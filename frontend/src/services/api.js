import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only log non-network errors to reduce console noise during development
    if (error.code !== "ERR_NETWORK") {
      console.error("API Error:", error);
    }
    return Promise.reject(error);
  }
);

// Projects API endpoints
export const projectsAPI = {
  // Get all projects with optional filters and pagination
  getProjects: (params = {}) => {
    return api.get("/api/projects", { params });
  },

  // Get single project by ID
  getProject: (id) => {
    return api.get(`/api/projects/${id}`);
  },

  // Get project filters/options
  getFilters: () => {
    return api.get("/projects");
  },
};

// Builders API endpoints
export const buildersAPI = {
  // Get all builders
  getBuilders: () => {
    return api.get("/builders");
  },

  // Get single builder by ID
  getBuilder: (id) => {
    return api.get(`/builders/${id}`);
  },
};

export default api;
