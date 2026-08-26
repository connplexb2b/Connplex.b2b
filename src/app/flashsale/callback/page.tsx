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
  const [status, setStatus] = useState<"verifying" | "success" | "failure">("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!orderId) {
      setStatus("failure");
      setErrorMessage("No order reference found. Please contact support.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch("/api/hdfc/verify-payment", {
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
  }, [orderId]);

  return (
    <div className="w-full max-w-md mx-auto p-8 surface-card rounded-lg text-center space-y-6">
      {status === "verifying" && (
        <div className="space-y-4">
          <Loader2 className="h-16 w-16 text-gold animate-spin mx-auto" />
          <h2 className="text-3xl font-display text-gradient-gold">Verifying Payment</h2>
          <p className="text-muted-foreground text-sm">
            We are verifying your transaction with HDFC Bank. Please do not close this window or refresh the page.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
          <h2 className="text-3xl font-display text-gradient-gold">Payment Successful!</h2>
          <p className="text-muted-foreground text-sm">
            Thank you! Your booking/lead has been confirmed. Our franchise team will get in touch with you shortly.
          </p>
          <Button onClick={() => router.push("/flashsale")} variant="gold" className="w-full h-12">
            Back to Flash Sale
          </Button>
        </div>
      )}

      {status === "failure" && (
        <div className="space-y-6">
          <XCircle className="h-16 w-16 text-rose-500 mx-auto" />
          <h2 className="text-3xl font-display text-gradient-gold">Payment Verification Failed</h2>
          <p className="text-muted-foreground text-sm">
            {errorMessage || "The transaction could not be processed successfully."}
          </p>
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
        <Suspense fallback={
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 text-gold animate-spin mx-auto" />
            <p className="text-muted-foreground font-display text-lg">Loading payment details...</p>
          </div>
        }>
          <CallbackContent />
        </Suspense>
      </div>
    </main>
  );
}
