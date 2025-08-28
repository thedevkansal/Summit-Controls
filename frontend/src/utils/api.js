// The base URL of our backend server
const API_BASE_URL = 'http://localhost:3001/api';

// A helper function to perform fetch requests with authentication
const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
  };

  // If we have a token, add it to the Authorization header
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      // If the server responds with an error, try to parse it as JSON
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || 'An error occurred');
    }

    // If the response has content, parse it as JSON
    if (response.status !== 204) { // 204 No Content
      return response.json();
    }
    
    // Otherwise, return null for empty responses
    return null;

  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error; // Re-throw the error to be caught by the component
  }
};

// --- Exported API Functions ---

// Fetch a single participant by their ID
export const getParticipantById = (id) => {
  return apiRequest(`/participant/${id}`);
};

// Fetch check-in history
export const getAllParticipants = () => {
  return apiRequest('/participants');
};

// Update a participant's check-in status
export const checkInParticipant = (id) => {
  return apiRequest(`/participant/${id}/checkin`, 'PUT');
};

// Fetch dashboard statistics
export const getStats = () => {
  return apiRequest('/stats');
};
