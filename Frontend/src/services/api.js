// API Base URL configuration
// For dev: uses relative paths that Vite proxies to 54.226.88.47:8080
// For production: uses direct URL to backend
const API_BASE_URL = '/api';
const DIRECT_BACKEND_URL = 'http://54.226.88.47:8080/api';

// Helper function to make API calls with fallback
async function apiFetch(endpoint, options = {}) {
  try {
    // Try relative path first (Vite proxy)
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return response;
  } catch (error) {
    // Fallback to direct URL
    console.warn('Proxy failed, using direct backend URL');
    return fetch(`${DIRECT_BACKEND_URL}${endpoint}`, options);
  }
}

// Authentication API Service
export const authService = {
  // Create a new user
  async signup(username, email, password) {
    const response = await apiFetch('/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
        creationDate: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    return response.json();
  },

  // Login user
  async login(email, password) {
    const response = await apiFetch('/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const user = await response.json();
    // Store user in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  // Get current user from localStorage
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Logout user
  logout() {
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('user');
  },
};

// Database API Service
export const databaseService = {
  // Create a new database
  async createDatabase(userId, dbName, dbType, dbVersion, description) {
    const response = await apiFetch('/db/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        dbName,
        dbType,
        dbVersion,
        description,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create database');
    }

    return response.json();
  },

  // Get user's databases
  async getUserDatabases(userId) {
    const response = await apiFetch(`/db/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch databases');
    }

    return response.json();
  },

  // Delete a database
  async deleteDatabase(dbId) {
    const response = await apiFetch(`/db/${dbId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete database');
      } catch (e) {
        throw new Error('Failed to delete database');
      }
    }

    // Handle both JSON and plain text responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      // If it's plain text, just return success
      return { success: true, message: await response.text() };
    }
  },

  // Generate connection string
  generateConnectionString(credentials) {
    const { username, password, port, dbName } = credentials;
    const host = window.location.hostname || 'localhost';
    return `postgresql://${username}:${password}@${host}:${port}/${dbName}`;
  },
};
