
// src/lib/api.ts

/**
 * Fetches data from the backend API with authorization header if a token is available.
 * @param url The API endpoint (e.g., '/api/users/me')
 * @param options RequestInit options for the fetch call
 * @returns Promise<any> The JSON response from the API
 * @throws Error if the request fails or returns a non-ok status
 */
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<any> {
  let token: string | null = null;
  if (typeof window !== 'undefined') { // Ensure localStorage is available (client-side)
    token = localStorage.getItem('supabase_token');
    console.log('fetchWithAuth: Token from localStorage for URL', url, ':', token); // Debugging line
  } else {
    console.warn('fetchWithAuth: window is undefined, cannot get token from localStorage for URL', url);
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('fetchWithAuth: No token found. Request to', url, 'will be unauthenticated.');
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    console.error("NEXT_PUBLIC_BACKEND_URL is not set. API calls will likely fail.");
    throw new Error("Variável de ambiente NEXT_PUBLIC_BACKEND_URL não configurada.");
  }
  const fullUrl = `${backendUrl}${url.startsWith('/') ? url : '/' + url}`;


  const response = await fetch(fullUrl, { ...options, headers });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // If response is not JSON, use statusText
      errorData = { message: response.statusText || `Request failed with status ${response.status}` };
    }
    console.error(`API Error (${response.status}) for ${fullUrl}: ${errorData.message || response.statusText}`, errorData);
    throw new Error(errorData.error || errorData.message || `Erro ${response.status}`);
  }

  // If response has no content (e.g., 204 No Content), return null or an empty object
  if (response.status === 204) {
    return null;
  }
  
  // Try to parse JSON, but handle cases where it might not be (e.g. plain text response)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    // If no content-type or not json, and status is OK, it might be an empty successful response or plain text.
    // For now, let's assume if it's not JSON and OK, it's likely an empty body from a successful action.
    // If text is expected, then response.text() should be used by the caller.
    // This generic fetchWithAuth aims for JSON by default.
    return {}; // Or response.text() if non-JSON is common
  }
}

export default fetchWithAuth;

