export const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost") {
      return "http://localhost:5000";
    }
  }
  return "https://connplex-b2b.onrender.com";
};