import axios from "axios";

// In-memory token cache
let cachedAccessToken = null;
let tokenExpiryTime = 0;

/**
 * Checks if Zoho CRM environment variables are fully configured.
 * This prevents crashes and API failures when keys are not set.
 */
const isZohoConfigured = () => {
  const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN } = process.env;
  return (
    ZOHO_CLIENT_ID &&
    ZOHO_CLIENT_ID !== "your_zoho_client_id_here" &&
    ZOHO_CLIENT_SECRET &&
    ZOHO_CLIENT_SECRET !== "your_zoho_client_secret_here" &&
    ZOHO_REFRESH_TOKEN &&
    ZOHO_REFRESH_TOKEN !== "your_zoho_refresh_token_here"
  );
};

/**
 * Refreshes the Zoho OAuth access token if it's expired or not available in cache.
 * Uses accounts.zoho.in endpoints for the Indian region.
 * @returns {Promise<string|null>} The active access token or null if Zoho is unconfigured.
 */
export const refreshZohoTokenIfExpired = async () => {
  if (!isZohoConfigured()) {
    console.warn("[Zoho Warning] CRM is not configured. Skipping token refresh.");
    return null;
  }

  // Check if token in memory is still valid (with a 5-minute safety buffer)
  const isTokenValid = cachedAccessToken && Date.now() < tokenExpiryTime - 300 * 1000;
  if (isTokenValid) {
    return cachedAccessToken;
  }

  try {
    console.log("[Zoho Token] Refreshing Zoho access token...");
    
    const params = new URLSearchParams();
    params.append("refresh_token", process.env.ZOHO_REFRESH_TOKEN);
    params.append("client_id", process.env.ZOHO_CLIENT_ID);
    params.append("client_secret", process.env.ZOHO_CLIENT_SECRET);
    params.append("grant_type", "refresh_token");
    if (process.env.ZOHO_REDIRECT_URI) {
      params.append("redirect_uri", process.env.ZOHO_REDIRECT_URI);
    }

    const response = await axios.post("https://accounts.zoho.in/oauth/v2/token", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.data && response.data.access_token) {
      cachedAccessToken = response.data.access_token;
      const expiresIn = response.data.expires_in || 3600;
      tokenExpiryTime = Date.now() + expiresIn * 1000;
      console.log(`[Zoho Token Success] Cached new access token. Expires in: ${expiresIn}s`);
      return cachedAccessToken;
    } else {
      throw new Error(`Invalid response body: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error(`[Zoho Token Error] Failed to refresh access token: ${errorMsg}`);
    throw new Error(`Zoho token refresh failed: ${errorMsg}`);
  }
};

/**
 * Returns a valid Zoho access token.
 * Alias wrapper around token refresh helper.
 * @returns {Promise<string|null>} The active access token.
 */
export const getZohoAccessToken = async () => {
  return await refreshZohoTokenIfExpired();
};

/**
 * Creates an entry inside a specific Zoho CRM module.
 * @param {string} moduleName The name of the Zoho CRM module (e.g. "Leads").
 * @param {Object} entryData The field mapping payload.
 * @returns {Promise<Object>} The API response details.
 */
export const createZohoModuleEntry = async (moduleName, entryData) => {
  const token = await getZohoAccessToken();
  if (!token) {
    console.warn(`[Zoho Warning] Skipping module entry for ${moduleName} - Zoho CRM is unconfigured.`);
    return { success: false, reason: "UNCONFIGURED" };
  }

  try {
    const response = await axios.post(
      `https://www.zohoapis.in/crm/v2/${moduleName}`,
      { data: [entryData] },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.data && response.data.data.length > 0) {
      const result = response.data.data[0];
      if (result.status === "success" || result.code === "SUCCESS") {
        console.log(`[Zoho Sync Success] Inserted record into module [${moduleName}]. ID: ${result.details.id}`);
        return { success: true, id: result.details.id };
      } else {
        throw new Error(`API validation code: ${result.code}, Message: ${result.message}`);
      }
    } else {
      throw new Error(`Unexpected empty data response from Zoho: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error(`[Zoho CRM Error] Failed insertion into module [${moduleName}]: ${errorMsg}`);
    throw new Error(`Zoho CRM insertion failed: ${errorMsg}`);
  }
};

/**
 * Creates a Lead in Zoho CRM Leads module.
 * @param {Object} leadData Mapped lead payload.
 * @returns {Promise<Object>} The API response details.
 */
export const createZohoLead = async (leadData) => {
  return await createZohoModuleEntry("Leads", leadData);
};

/**
 * Standard utility mapping layer. Parses form names, maps standard Zoho fields,
 * and compiles additional fields into the Leads Description block.
 * @param {string} modelName The Mongoose Model name.
 * @param {Object} document The saved MongoDB document.
 */
export const syncFormToZoho = async (modelName, document) => {
  if (!isZohoConfigured()) {
    console.log(`[Zoho Sync] Skipping sync for model [${modelName}] - Zoho CRM keys not configured in environment.`);
    return;
  }

  console.log(`[Zoho Sync] Triggering background sync for model [${modelName}]...`);
  
  const rawData = document.toObject ? document.toObject() : document;

  // 1. Parse full name into First Name & Last Name (Zoho Leads requires Last_Name)
  let firstName = "";
  let lastName = "Unknown";

  const nameInput = rawData.fullName || rawData.name || "";
  if (nameInput) {
    const parts = nameInput.trim().split(/\s+/);
    if (parts.length > 1) {
      firstName = parts[0];
      lastName = parts.slice(1).join(" ");
    } else {
      lastName = parts[0] || "Unknown";
    }
  } else if (rawData.email) {
    // Fallback: use email prefix as last name
    lastName = rawData.email.split("@")[0];
  }

  // 2. Determine lead source based on modelName
  let leadSource = "Website Inquiry";
  switch (modelName) {
    case "BookEvent":
      leadSource = "Website - Book Event Form";
      break;
    case "ConnEventsWaitlist":
      leadSource = "Website - ConnEvents Waitlist";
      break;
    case "ConnflixSubscriber":
      leadSource = "Website - Connflix Waitlist";
      break;
    case "ConnmusicWaitlist":
      leadSource = "Website - Connmusic Waitlist";
      break;
    case "StudioInvitation":
      leadSource = "Website - Studio Invitation";
      break;
    case "ContactMessage":
      leadSource = "Website - Contact Message Form";
      break;
    case "DowntownInvitation":
      leadSource = "Website - Downtown VIP Invitation";
      break;
    case "FranchiseInquiry":
      leadSource = "Website - Franchise Inquiry Form";
      break;
    case "PurexSubscriber":
      leadSource = "Website - Pure-X Waitlist";
      break;
    case "SkyinnReservation":
      leadSource = "Website - Sky-Inn VIP Modal";
      break;
    case "Newsletter":
      leadSource = "Website - Newsletter Subscriber";
      break;
    case "VendorRegistration":
      leadSource = "Website - Vendor Registration Form";
      break;
    case "ConsultantBooking":
      leadSource = "Website - Consultant Booking Form";
      break;
    case "CareerApplication":
      leadSource = "Website - Career Application Form";
      break;
    case "GeneralInquiry":
      leadSource = "Website - General Inquiry Form";
      break;
  }

  // 3. Compile all keys into Lead Description block for full visibility
  let description = `Form: ${modelName}\nSubmitted At: ${new Date().toISOString()}\n\nFull Details:\n`;
  Object.keys(rawData).forEach((key) => {
    // Exclude database metadata
    if (key !== "_id" && key !== "__v" && key !== "createdAt" && key !== "updatedAt") {
      const val = rawData[key];
      const formattedVal = val instanceof Date ? val.toDateString() : val;
      description += `${key}: ${formattedVal}\n`;
    }
  });

  // 4. Construct standard Leads module payload
  const leadPayload = {
    First_Name: firstName,
    Last_Name: lastName,
    Email: rawData.email || "",
    Phone: rawData.phone || rawData.phoneNumber || "",
    City: rawData.city || rawData.preferredCity || "",
    State: rawData.state || "",
    Company: rawData.company || rawData.companyName || "Individual",
    Lead_Source: leadSource,
    Description: description,
  };

  // 5. Handle optional custom layouts / fields if provided
  if (rawData.disclaimer !== undefined) {
    leadPayload.Disclaimer = String(rawData.disclaimer);
  }

  // 6. Execute Zoho CRM Leads creation
  await createZohoLead(leadPayload);
};
