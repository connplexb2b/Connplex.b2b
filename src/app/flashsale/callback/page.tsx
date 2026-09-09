"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Nav } from "@/components/landing/Nav";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id") || searchParams.get("orderId");
  const trackingId = searchParams.get("tracking_id") || searchParams.get("trackingId");
  const statusParam = searchParams.get("status");
  const messageParam = searchParams.get("message");

  const [status, setStatus] = useState<"verifying" | "success" | "failure">(() => {
    if (statusParam === "success") return "success";
    if (statusParam === "failure") return "failure";
    return "verifying";
  });
  const [errorMessage, setErrorMessage] = useState(messageParam || "");

  useEffect(() => {
    // If status was already passed from CCAvenue callback redirect
    if (statusParam === "success") {
      setStatus("success");
      return;
    }
    if (statusParam === "failure") {
      setStatus("failure");
      setErrorMessage(messageParam || "Payment was not successful.");
      return;
    }

    if (!orderId) {
      setStatus("failure");
      setErrorMessage("No order reference found. Please contact support.");
      return;
    }

    // Fallback: Check verification endpoint if order_id is present without status param
    const verifyPayment = async () => {
      try {
        const response = await fetch("/api/ccavenue/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order_id: orderId }),
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setStatus("success");
        } else {
          setStatus("failure");
          setErrorMessage(data.message || "We could not verify your payment status.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("failure");
        setErrorMessage("Something went wrong during payment verification. Please try again.");
      }
    };

    verifyPayment();
  }, [orderId, statusParam, messageParam]);

  return (
    <div className="w-full max-w-lg mx-auto p-8 surface-card rounded-lg text-center space-y-6">
      {status === "verifying" && (
        <div className="space-y-4">
          <Loader2 className="h-16 w-16 text-gold animate-spin mx-auto" />
          <h2 className="text-3xl font-display text-gradient-gold">Verifying Payment</h2>
          <p className="text-muted-foreground text-sm">
            We are verifying your transaction with HDFC CCAvenue. Please do not close this window or refresh the page.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
          <h2 className="text-3xl font-display text-gradient-gold">Payment Successful!</h2>
          <p className="text-muted-foreground text-sm">
            Thank you! Your franchise fee booking has been received and confirmed. Our franchise leadership desk will get in touch with you shortly.
          </p>
          {(orderId || trackingId) && (
            <div className="bg-background/80 rounded border border-border p-4 text-left text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Final Amount:</span>
                <span className="text-foreground font-semibold">₹11,80,000 (incl. 18% GST)</span>
              </div>
              {orderId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="text-foreground font-semibold">{orderId}</span>
                </div>
              )}
              {trackingId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CCAvenue Tracking ID:</span>
                  <span className="text-foreground font-semibold">{trackingId}</span>
                </div>
              )}
            </div>
          )}
          <Button onClick={() => router.push("/flashsale")} variant="gold" className="w-full h-12">
            Back to Flash Sale
          </Button>
        </div>
      )}

      {status === "failure" && (
        <div className="space-y-6">
          <XCircle className="h-16 w-16 text-rose-500 mx-auto" />
          <h2 className="text-3xl font-display text-gradient-gold">Payment Unsuccessful</h2>
          <p className="text-muted-foreground text-sm">
            {errorMessage || "The transaction could not be completed or was cancelled."}
          </p>
          {orderId && (
            <div className="bg-background/80 rounded border border-border p-3 text-xs text-muted-foreground font-mono">
              Reference: {orderId}
            </div>
          )}
          <div className="space-y-2">
            <Button onClick={() => router.push("/flashsale#apply")} variant="gold" className="w-full h-12">
              Try Again
            </Button>
            <Button onClick={() => router.push("/flashsale")} variant="outline" className="w-full h-12">
              Go to Home
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HdfcCallbackPage() {
  return (
    <main className="flashsale-theme min-h-screen bg-background text-foreground flex flex-col">
      <Nav />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <Suspense
          fallback={
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 text-gold animate-spin mx-auto" />
              <p className="text-muted-foreground font-display text-lg">Loading payment details...</p>
            </div>
          }
        >
          <CallbackContent />
        </Suspense>
      </div>
    </main>
  );
}
