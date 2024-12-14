import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'http://47.128.146.244:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Debug request
      console.log('API Request:', {
        method: config.method,
        url: config.url,
        params: config.params,
        data: config.data,
        headers: config.headers
      });
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Debug successful response
    console.log('API Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    if (error.response) {
      // Debug error response
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        config: {
          method: error.config.method,
          url: error.config.url,
          params: error.config.params,
          data: error.config.data
        }
      });

      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          await AsyncStorage.removeItem('token');
          throw new Error('Your session has expired. Please log in again.');
        case 403:
          throw new Error('You do not have permission to access this resource.');
        case 404:
          throw new Error('The requested resource was not found.');
        case 500:
          console.error('Server Error:', error.response.data);
          throw new Error('An unexpected error occurred. Please try again later.');
        default:
          throw new Error(error.response.data?.message || 'An error occurred while processing your request.');
      }
    }
    throw error;
  }
);

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export const handleApiError = (error: any): never => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    console.error('API Error:', {
      status: error.response?.status,
      message: message,
      data: error.response?.data
    });
    throw new Error(message);
  }
  throw error;
};
