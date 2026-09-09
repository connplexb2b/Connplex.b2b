import nodemailer from "nodemailer";

interface PaymentEmailParams {
  to: string;
  fullName: string;
  orderId: string;
  trackingId?: string;
  bankRefNo?: string;
  amountPaid?: number | string;
  paymentMode?: string;
  city?: string;
}

/**
 * Creates a Nodemailer transporter using environment variables.
 * Compatible with Gmail, Zoho Mail, AWS SES, SendGrid, Brevo, or any custom SMTP server.
 */
function getEmailTransporter() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_SERVER_HOST;
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_SERVER_PORT || "465", 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_SERVER_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_SERVER_PASSWORD;
  const secure = process.env.SMTP_SECURE !== undefined ? process.env.SMTP_SECURE === "true" : port === 465;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Sends an official payment confirmation email to the customer and notifies the team.
 */
export async function sendPaymentConfirmationEmail({
  to,
  fullName,
  orderId,
  trackingId = "N/A",
  bankRefNo = "N/A",
  amountPaid = 1180000,
  paymentMode = "Online",
  city = "N/A",
}: PaymentEmailParams) {
  const transporter = getEmailTransporter();
  const fromEmail = process.env.EMAIL_FROM || process.env.SMTP_USER || "Connplex Cinemas <marketing@theconnplex.com>";
  const adminNotificationEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "marketing@theconnplex.com";

  const formattedAmount =
    typeof amountPaid === "number"
      ? `₹${amountPaid.toLocaleString("en-IN")}`
      : String(amountPaid).startsWith("₹")
      ? String(amountPaid)
      : `₹${amountPaid}`;

  const paymentDate = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Confirmation - Connplex Cinema Franchise</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0b0c0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f0f0f2; }
    .container { max-width: 600px; margin: 30px auto; background-color: #121316; border: 1px solid #2a2418; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(180deg, #1c1810 0%, #121316 100%); padding: 36px 30px; text-align: center; border-bottom: 1px solid #3d321d; }
    .gold-tag { display: inline-block; padding: 5px 14px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #c5a059; border: 1px solid rgba(197, 160, 89, 0.4); border-radius: 4px; margin-bottom: 14px; }
    .title { margin: 0; font-size: 26px; font-weight: 700; color: #e6c875; letter-spacing: 0.5px; }
    .content { padding: 32px 30px; }
    .greeting { font-size: 16px; margin-bottom: 16px; color: #f0f0f2; }
    .message { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin-bottom: 24px; }
    .amount-box { background: rgba(197, 160, 89, 0.08); border: 1px solid #4a3c1c; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 28px; }
    .amount-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #a1a1aa; margin-bottom: 6px; }
    .amount-value { font-size: 32px; font-weight: 800; color: #e6c875; margin: 0; }
    .amount-gst { font-size: 13px; color: #d4af37; margin-top: 4px; font-weight: 500; }
    .details-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; font-size: 13px; }
    .details-table td { padding: 12px 14px; border-bottom: 1px solid #23252a; }
    .details-table td.label { color: #71717a; width: 40%; }
    .details-table td.value { color: #f0f0f2; font-weight: 600; text-align: right; }
    .next-steps { background-color: #17181c; border-radius: 8px; padding: 20px; margin-bottom: 28px; }
    .next-steps-title { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #c5a059; margin-top: 0; margin-bottom: 12px; font-weight: 700; }
    .next-steps ul { margin: 0; padding-left: 18px; color: #a1a1aa; font-size: 13px; line-height: 1.6; }
    .next-steps li { margin-bottom: 8px; }
    .footer { background-color: #0d0e11; padding: 24px 30px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid #1f2128; }
    .footer a { color: #c5a059; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="gold-tag">Connplex Cinemas</div>
      <h1 class="title">Payment Confirmed</h1>
    </div>
    
    <div class="content">
      <p class="greeting">Dear <strong>${fullName}</strong>,</p>
      <p class="message">
        Thank you for booking your Connplex Cinema Franchise opportunity under the exclusive Flash Sale cycle. Your booking fee has been successfully processed and confirmed.
      </p>

      <div class="amount-box">
        <div class="amount-label">Total Amount Paid</div>
        <div class="amount-value">${formattedAmount}</div>
        <div class="amount-gst">18% GST Included (Base: ₹10,00,000 + GST: ₹1,80,000)</div>
      </div>

      <table class="details-table">
        <tr>
          <td class="label">Customer Name</td>
          <td class="value">${fullName}</td>
        </tr>
        <tr>
          <td class="label">Preferred City / Territory</td>
          <td class="value">${city}</td>
        </tr>
        <tr>
          <td class="label">Order Reference ID</td>
          <td class="value" style="font-family: monospace;">${orderId}</td>
        </tr>
        ${
          trackingId && trackingId !== "N/A"
            ? `<tr>
                <td class="label">CCAvenue Tracking ID</td>
                <td class="value" style="font-family: monospace;">${trackingId}</td>
              </tr>`
            : ""
        }
        ${
          bankRefNo && bankRefNo !== "N/A"
            ? `<tr>
                <td class="label">Bank Reference No</td>
                <td class="value" style="font-family: monospace;">${bankRefNo}</td>
              </tr>`
            : ""
        }
        <tr>
          <td class="label">Payment Mode</td>
          <td class="value">${paymentMode}</td>
        </tr>
        <tr>
          <td class="label">Payment Date & Time</td>
          <td class="value">${paymentDate} IST</td>
        </tr>
        <tr>
          <td class="label">Status</td>
          <td class="value" style="color: #10b981;">SUCCESS / CONFIRMED</td>
        </tr>
      </table>

      <div class="next-steps">
        <div class="next-steps-title">What Happens Next</div>
        <ul>
          <li>Our <strong>Franchise Leadership Desk</strong> will connect with you directly within 24 hours.</li>
          <li>We will initiate the <strong>site feasibility and territory review</strong> for ${city}.</li>
          <li>Your exclusive ₹5,00,000 franchise entry benefit is now reserved and documented.</li>
        </ul>
      </div>

      <p class="message" style="margin-bottom: 0;">
        If you have any immediate questions, feel free to reach out to our franchise desk at <a href="mailto:marketing@theconnplex.com" style="color: #c5a059; text-decoration: none;">marketing@theconnplex.com</a>.
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 8px 0;"><strong>Connplex Smart Luxury Cinemas Limited</strong></p>
      <p style="margin: 0;">Website: <a href="https://theconnplex.com">www.theconnplex.com</a> | Ahmedabad, Gujarat, India</p>
    </div>
  </div>
</body>
</html>
  `;

  if (!transporter) {
    console.warn(
      `[Email Warning] SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS) not configured. Confirmation email for order ${orderId} was NOT sent to ${to}.`
    );
    return { success: false, reason: "SMTP not configured" };
  }

  try {
    const mailOptions = {
      from: fromEmail,
      to: to,
      bcc: adminNotificationEmail !== to ? adminNotificationEmail : undefined,
      subject: `Payment Confirmed: Connplex Cinema Franchise Booking (${orderId})`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Success] Confirmation email sent to ${to} for order ${orderId}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[Email Error] Failed to send payment confirmation email to ${to}:`, err);
    return { success: false, error: err.message || String(err) };
  }
}
