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
export const refreshZohoAccessToken = async () => {
  console.log("[Zoho Token] Checking credentials configuration...");
  if (!isZohoConfigured()) {
    console.warn("[Zoho Warning] CRM credentials are not configured or set to default placeholders. Skipping token refresh.");
    return null;
  }

  // Check if token in memory is still valid (with a 5-minute safety buffer)
  const isTokenValid = cachedAccessToken && Date.now() < tokenExpiryTime - 300 * 1000;
  console.log(`[Zoho Token] Token validity check: Expiry = ${tokenExpiryTime > 0 ? new Date(tokenExpiryTime).toISOString() : "0"}, Valid = ${isTokenValid}`);
  
  if (isTokenValid) {
    return cachedAccessToken;
  }

  try {
    console.log("[Zoho Token] Refreshing token at accounts.zoho.in/oauth/v2/token...");
    
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

    console.log(`[Zoho Token Response] Body: ${JSON.stringify(response.data)}`);

    if (response.data && response.data.access_token) {
      cachedAccessToken = response.data.access_token;
      const expiresIn = response.data.expires_in || 3600;
      tokenExpiryTime = Date.now() + expiresIn * 1000;
      console.log(`[Zoho Token Success] Cached new access token. Expires in: ${expiresIn}s`);
      return cachedAccessToken;
    } else {
      throw new Error(`Refresh token response missing access_token parameter: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error(`[Zoho Token Error] Failed to refresh access token: ${errorMsg}`);
    throw new Error(`Zoho token refresh failed: ${errorMsg}`);
  }
};

/**
 * Returns a valid Zoho access token.
 * @returns {Promise<string|null>} The active access token.
 */
export const getZohoAccessToken = async () => {
  return await refreshZohoAccessToken();
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

  console.log(`[Zoho Request] Endpoint: POST https://www.zohoapis.in/crm/v2/${moduleName}`);
  console.log(`[Zoho Request] Payload: ${JSON.stringify({ data: [entryData] }, null, 2)}`);

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

    console.log(`[Zoho Response] Status Code: ${response.status}`);
    console.log(`[Zoho Response] Body: ${JSON.stringify(response.data, null, 2)}`);

    if (response.data && response.data.data && response.data.data.length > 0) {
      const result = response.data.data[0];
      if (result.status === "success" || result.code === "SUCCESS") {
        console.log(`[Zoho Success] Inserted record into module [${moduleName}]. ID: ${result.details.id}`);
        return { success: true, id: result.details.id };
      } else {
        const validationErr = new Error(`API Validation Code: ${result.code}, Message: ${result.message}`);
        validationErr.zohoDetails = result;
        throw validationErr;
      }
    } else {
      throw new Error(`Unexpected empty data response from Zoho: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    const responseData = error.response ? error.response.data : (error.zohoDetails || error.message);
    console.error(`[Zoho Error] HTTP failure or API exception: Status ${error.response?.status || "N/A"}. Response: ${JSON.stringify(responseData, null, 2)}`);
    
    const wrappedError = new Error(`Zoho CRM insertion failed: ${error.message}`);
    wrappedError.responseDetails = responseData;
    wrappedError.statusCode = error.response?.status;
    throw wrappedError;
  }
};

/**
 * Filter out speculative custom fields, validate formats, and ensure required fields are present.
 * @param {Object} payload The raw mapped payload.
 * @returns {Object} Cleaned payload containing only standard Lead fields.
 */
export const validateZohoFields = (payload) => {
  const allowedFields = [
    "First_Name",
    "Last_Name",
    "Company",
    "Email",
    "Phone",
    "Mobile",
    "City",
    "State",
    "Lead_Source",
    "Description",
    "Disclaimer"
  ];

  const validated = {};
  Object.keys(payload).forEach((key) => {
    if (allowedFields.includes(key) && payload[key] !== undefined && payload[key] !== null) {
      validated[key] = payload[key];
    }
  });

  // Apply safe fallback values for mandatory Lead fields
  if (!validated.Last_Name || String(validated.Last_Name).trim() === "") {
    validated.Last_Name = "Unknown";
  }
  if (!validated.Company || String(validated.Company).trim() === "") {
    validated.Company = "Connplex";
  }

  return validated;
};

/**
 * Strips payload to a minimal safe schema guaranteed to exist in standard layouts.
 * @param {Object} payload Mapped lead payload.
 * @returns {Object} Strictest minimal payload.
 */
export const stripToMinimalSafe = (payload) => {
  return {
    Last_Name: payload.Last_Name || "Unknown",
    Company: payload.Company || "Connplex",
    Email: payload.Email || "",
    Phone: payload.Phone || "",
    Description: payload.Description || "",
    Lead_Source: payload.Lead_Source || "Website Inquiry"
  };
};

/**
 * Reusable universal synchronization function. Maps frontend fields dynamically
 * to standard Lead parameters, serializes full form JSON in Description, and submits to Zoho.
 * @param {Object} params Config object.
 * @param {string} params.module Zoho CRM module (default "Leads").
 * @param {Object} params.data Raw form data payload from request or DB document.
 * @param {string} params.source Label identifier for Lead_Source tracking.
 */
export const syncToZoho = async ({ module = "Leads", data, source = "Website Inquiry" }) => {
  if (!isZohoConfigured()) {
    console.log(`[Zoho Sync] Skipping sync - Zoho CRM keys not configured in environment.`);
    return;
  }

  console.log(`[Zoho Sync] Triggering background sync to module [${module}]...`);
  
  const rawData = data.toObject ? data.toObject() : data;

  // 1. Map fields dynamically across standard naming variations
  const emailVal = rawData.email || rawData.emailAddress || "";
  const phoneVal = rawData.phone || rawData.phoneNumber || rawData.mobile || "";

  // Parse names (Last Name is required)
  let firstName = "";
  let lastName = "Unknown";
  const nameVal = rawData.fullName || rawData.name || rawData.contactName || rawData.contactPerson || "";
  if (nameVal) {
    const parts = nameVal.trim().split(/\s+/);
    if (parts.length > 1) {
      firstName = parts[0];
      lastName = parts.slice(1).join(" ");
    } else {
      lastName = parts[0] || "Unknown";
    }
  } else if (emailVal) {
    lastName = emailVal.split("@")[0];
  }

  // Company details
  const companyVal = rawData.company || rawData.companyName || rawData.businessName || "Connplex";

  // Location fields
  const cityVal = rawData.city || rawData.preferredCity || "";
  const stateVal = rawData.state || "";

  // 2. Compile full JSON data structure inside Description box
  let description = `Form Details\nSubmitted At: ${new Date().toISOString()}\n\nFull JSON Data:\n`;
  description += JSON.stringify(rawData, null, 2);

  // 3. Construct payload object
  const leadPayload = {
    First_Name: firstName,
    Last_Name: lastName,
    Email: emailVal,
    Phone: phoneVal,
    Company: companyVal,
    City: cityVal,
    State: stateVal,
    Lead_Source: source,
    Description: description,
  };

  if (rawData.disclaimer !== undefined) {
    leadPayload.Disclaimer = String(rawData.disclaimer);
  }

  // 4. Validate fields and execute API sync with custom retry safety fallbacks
  const validatedPayload = validateZohoFields(leadPayload);
  try {
    console.log(`[Zoho Sync] Attempting entry creation in module [${module}]...`);
    return await createZohoModuleEntry(module, validatedPayload);
  } catch (primaryError) {
    console.warn(`[Zoho Error] Primary schema sync failed: ${primaryError.message}. Retrying with MINIMAL SAFE standard payload...`);
    const minimalPayload = stripToMinimalSafe(leadPayload);
    try {
      return await createZohoModuleEntry(module, minimalPayload);
    } catch (fallbackError) {
      console.error(`[Zoho Error] Minimal safe payload retry failed: ${fallbackError.message}`);
      throw fallbackError;
    }
  }
};

/**
 * Creates a Lead in Zoho CRM Leads module using universal sync.
 * @param {Object} leadData Mapped lead payload.
 * @returns {Promise<Object>} The API response details.
 */
export const createZohoLead = async (leadData) => {
  return await syncToZoho({ module: "Leads", data: leadData });
};
