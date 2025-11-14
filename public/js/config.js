/* eslint-disable */
// API Configuration - automatically detects environment
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Check if we're in local development (localhost or 127.0.0.1)
  const isLocalDev =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '';

  if (isLocalDev) {
    // Use relative URL for local development
    return cleanEndpoint;
  } else {
    // Use production API URL
    return `https://sentours.onrender.com${cleanEndpoint}`;
  }
};
