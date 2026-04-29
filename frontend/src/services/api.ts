import axios from 'axios';

const USERS_API = 'http://127.0.0.1:8000/api';
const SUBS_API = 'http://127.0.0.1:8006/api';
const BICEP_API = 'http://127.0.0.1:8003/api/bicep';
const PUSHUP_API = 'http://127.0.0.1:8004/api/pushup';
const CHAT_API = 'http://127.0.0.1:8002/chat-api';
const PROGRAM_API = 'http://127.0.0.1:8001/program-api';
const PROBLEMS_API = 'http://127.0.0.1:8005/api';
const FOOD_API = 'http://127.0.0.1:5000';

// Create instances for each service
const usersApi = axios.create({ baseURL: USERS_API });
const subsApi = axios.create({ baseURL: SUBS_API });
const bicepApi = axios.create({ baseURL: BICEP_API });
const pushupApi = axios.create({ baseURL: PUSHUP_API });
const chatApi = axios.create({ baseURL: CHAT_API });
const programApi = axios.create({ baseURL: PROGRAM_API });
const problemsApi = axios.create({ baseURL: PROBLEMS_API });
const foodApi = axios.create({ baseURL: FOOD_API });


// Add interceptor to inject token
const addAuthToken = (config: any) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

usersApi.interceptors.request.use(addAuthToken);
subsApi.interceptors.request.use(addAuthToken);
bicepApi.interceptors.request.use(addAuthToken);
pushupApi.interceptors.request.use(addAuthToken);
chatApi.interceptors.request.use(addAuthToken);
programApi.interceptors.request.use(addAuthToken);
problemsApi.interceptors.request.use(addAuthToken);

export const api = {
  // Auth
  login: (credentials: any) => usersApi.post('/users/login/', credentials),
  setToken: (token: string | null) => {
    // This is now handled by interceptors, but we keep it for compatibility
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },

  // Users Service
  getUsers: () => usersApi.get('/users/'),
  createUser: (data: any) => usersApi.post('/users/', data),
  updateUser: (id: number, data: any) => usersApi.put(`/users/${id}/`, data),
  deleteUser: (id: number) => usersApi.delete(`/users/${id}/`),
  
  // Subscriptions Service
  getPlans: () => subsApi.get('/plans/'),
  createPlan: (data: any) => subsApi.post('/plans/', data),
  updatePlan: (id: number, data: any) => subsApi.put(`/plans/${id}/`, data),
  deletePlan: (id: number) => subsApi.delete(`/plans/${id}/`),
  getSubscriptions: () => subsApi.get('/admin/subscriptions/'),
  getMySubscription: () => subsApi.get('/my-subscription/'),
  createSubscription: (data: any) => subsApi.post('/subscribe/', data),


  // Bicep Service
  analyzeBicepVideo: (videoFile: File) => {
    const formData = new FormData();
    formData.append('video', videoFile);
    return bicepApi.post('/analyze/video/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  analyzeBicepFrame: (imageBase64: string) => bicepApi.post('/analyze/frame/', { image: imageBase64 }),

  // Pushup Service
  analyzePushupVideo: (videoFile: File) => {
    const formData = new FormData();
    formData.append('video', videoFile);
    return pushupApi.post('/analyze/video/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  analyzePushupFrame: (imageBase64: string) => pushupApi.post('/analyze/frame/', { image: imageBase64 }),

  // Food Service
  predictFood: (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return foodApi.post('/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Chat Service
  chat: (messages: any[], context?: any) => chatApi.post('/chat', { messages, context }),

  // Program Service
  generateProgram: (data: any) => programApi.post('/program/generate', data),
  getMyProgram: (userId: number) => programApi.get(`/program/get?user_id=${userId}`),

  // Clients Problems Service
  getProblems: () => problemsApi.get('/problems/'),
  submitProblem: (data: { user_id: number, problem: string }) => problemsApi.post('/problems/', data),
  deleteProblem: (id: number) => problemsApi.delete(`/problems/${id}/`),

  toggleSubscriptionStatus: (id: number) => subsApi.post(`/admin/subscriptions/${id}/toggle/`),
};


