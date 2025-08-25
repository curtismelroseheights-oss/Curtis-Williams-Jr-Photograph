import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Personal Information API
export const personalApi = {
  get: async () => {
    const response = await api.get('/personal');
    return response.data;
  },
  
  update: async (data) => {
    const response = await api.put('/personal', data);
    return response.data;
  }
};

// Social Links API
export const socialApi = {
  get: async () => {
    const response = await api.get('/social');
    return response.data;
  },
  
  update: async (data) => {
    const response = await api.put('/social', data);
    return response.data;
  }
};

// Skills API
export const skillsApi = {
  getAll: async () => {
    const response = await api.get('/skills');
    return response.data;
  },
  
  create: async (skillData) => {
    const response = await api.post('/skills', skillData);
    return response.data;
  },
  
  update: async (id, skillData) => {
    const response = await api.put(`/skills/${id}`, skillData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  }
};

// Experience API
export const experienceApi = {
  getAll: async () => {
    const response = await api.get('/experience');
    return response.data;
  },
  
  create: async (expData) => {
    const response = await api.post('/experience', expData);
    return response.data;
  },
  
  update: async (id, expData) => {
    const response = await api.put(`/experience/${id}`, expData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/experience/${id}`);
    return response.data;
  }
};

// Projects API
export const projectsApi = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
  
  create: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },
  
  update: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  }
};

// Portfolio Images API
export const imagesApi = {
  getAll: async (category = null) => {
    const url = category ? `/images?category=${category}` : '/images';
    const response = await api.get(url);
    return response.data;
  },
  
  upload: async (file, title, description, category, featured = false) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('featured', featured);
    
    const response = await api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  update: async (id, imageData) => {
    const response = await api.put(`/images/${id}`, imageData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/images/${id}`);
    return response.data;
  }
};

// Videos API
export const videosApi = {
  getAll: async (category = null) => {
    const url = category ? `/videos?category=${category}` : '/videos';
    const response = await api.get(url);
    return response.data;
  },
  
  upload: async (file, title, description, category, featured = false) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);  
    formData.append('featured', featured);
    
    const response = await api.post('/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  update: async (id, videoData) => {
    const response = await api.put(`/videos/${id}`, videoData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  }
};

// Awards API
export const awardsApi = {
  getAll: async () => {
    const response = await api.get('/awards');
    return response.data;
  },
  
  create: async (awardData) => {
    const response = await api.post('/awards', awardData);
    return response.data;
  },
  
  update: async (id, awardData) => {
    const response = await api.put(`/awards/${id}`, awardData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/awards/${id}`);
    return response.data;
  }
};

// Utility function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    console.error('API Error:', error.response.data);
    return error.response.data.detail || 'An error occurred';
  } else if (error.request) {
    // Request was made but no response received
    console.error('Network Error:', error.request);
    return 'Network error - please check your connection';
  } else {
    // Other error
    console.error('Error:', error.message);
    return error.message;
  }
};

export default api;