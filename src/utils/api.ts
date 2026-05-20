/**
 * Utility to retrieve the base API URL for the backend server.
 * Fallback to the production backend on Render if not specified.
 */
export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://connplex-b2b.onrender.com';
};
