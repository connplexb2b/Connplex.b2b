import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";
import { ccavenueDecrypt, parseCcavenueResponse } from "@/lib/ccavenue";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const encResp = formData.get("encResp") as string;

    const workingKey = process.env.CCAVENUE_WORKING_KEY || "D2C68ED69DE261106CE808F2E14CE4B0";
    let appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://theconnplex.com";

    // Determine return URL host from request
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "https";
    if (host) {
      appUrl = `${proto}://${host}`;
    }

    if (!encResp) {
      console.error("CCAvenue callback received without encResp");
      return NextResponse.redirect(
        new URL("/flashsale/callback?status=failure&message=No+response+received+from+payment+gateway", appUrl),
        303
      );
    }

    // 1. Decrypt CCAvenue Response
    const decryptedText = ccavenueDecrypt(encResp, workingKey);
    const parsedData = parseCcavenueResponse(decryptedText);

    const orderId = parsedData.order_id || "";
    const trackingId = parsedData.tracking_id || "";
    const bankRefNo = parsedData.bank_ref_no || "";
    const orderStatus = parsedData.order_status || "Unknown"; // "Success", "Failure", "Aborted", etc.
    const failureMessage = parsedData.failure_message || parsedData.status_message || "";
    const paymentMode = parsedData.payment_mode || "";
    const cardName = parsedData.card_name || "";

    // 2. Connect to Database & Update Record
    await connectToDatabase();
    const db = mongoose.connection.db;

    const isSuccess = orderStatus.toLowerCase() === "success";

    if (db && orderId) {
      const lead = await db.collection("contactmessages").findOne({
        $or: [
          { order_id: orderId },
          { ccavenue_order_id: orderId },
          { hdfc_order_id: orderId },
        ],
      });

      if (lead) {
        const updatedMessage =
          lead.message.replace("Payment Status: Pending", `Payment Status: ${isSuccess ? "Paid" : "Failed"}`) +
          `\nCCAvenue Tracking ID: ${trackingId}\nBank Ref No: ${bankRefNo}\nPayment Mode: ${paymentMode} (${cardName})`;

        await db.collection("contactmessages").updateOne(
          { _id: lead._id },
          {
            $set: {
              paymentStatus: isSuccess ? "Paid" : "Failed",
              ccavenue_tracking_id: trackingId,
              ccavenue_bank_ref_no: bankRefNo,
              payment_mode: paymentMode,
              card_name: cardName,
              ccavenue_status: orderStatus,
              message: updatedMessage,
              updatedAt: new Date(),
            },
          }
        );

        // 3. Fire Bitamin Webhook if Success
        if (isSuccess) {
          try {
            const cleanedPhone = lead.phone ? lead.phone.toString().replace(/\D/g, "") : "";
            const formattedPhone = cleanedPhone.length === 10 ? `91${cleanedPhone}` : cleanedPhone;
            const webhookPayload = {
              user_phone: formattedPhone,
              event_key: "flashsale-lead",
              payload: {
                _id: lead._id.toString(),
                fullName: lead.fullName,
                email: lead.email,
                phone: lead.phone,
                city: lead.city,
                timeframe: lead.timeframe,
                order_id: orderId,
                ccavenue_tracking_id: trackingId,
                bank_ref_no: bankRefNo,
                amountPaid: lead.amountPaid,
                paymentStatus: "Paid",
                paymentMode: `${paymentMode} - ${cardName}`,
                createdAt: lead.createdAt,
                updatedAt: new Date().toISOString(),
              },
            };

            await fetch(
              "https://api.bitamin.com/webhook/theconnplex/019dbfa5-ead7-761d-944d-9260ef66b5aa",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(webhookPayload),
              }
            );
          } catch (webhookError) {
            console.error("Error triggering Bitamin webhook in CCAvenue callback:", webhookError);
          }
        }
      }
    }

    // 4. Redirect User to the Callback Page with status & tracking params
    const redirectParams = new URLSearchParams({
      status: isSuccess ? "success" : "failure",
      order_id: orderId,
      tracking_id: trackingId,
      message: failureMessage,
    });

    return NextResponse.redirect(
      new URL(`/flashsale/callback?${redirectParams.toString()}`, appUrl),
      303
    );
  } catch (error: any) {
    console.error("Error processing CCAvenue callback:", error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://theconnplex.com";
    return NextResponse.redirect(
      new URL(`/flashsale/callback?status=failure&message=Callback+processing+failed`, appUrl),
      303
    );
  }
}

export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://theconnplex.com";
  return NextResponse.redirect(new URL("/flashsale", appUrl), 303);
}
