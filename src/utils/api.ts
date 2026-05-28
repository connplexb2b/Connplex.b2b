export const getApiUrl = () => {
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost") {
      return "http://localhost:5000";
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || "https://connplex-b2b.onrender.com";
};