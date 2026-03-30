import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses (token expired / invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getForms = (teamId?: string) =>
  api.get('/forms', { params: { team_id: teamId } }).then((res: any) => res.data);

export const getForm = (idOrRoute: string) =>
  api.get(`/forms/${idOrRoute}`).then((res: any) => res.data);

export const createForm = (data: any) =>
  api.post('/forms', data).then((res: any) => res.data);

export const updateForm = (id: string, data: any) =>
  api.put(`/forms/${id}`, data).then((res: any) => res.data);

export const submitForm = (id: string, submissionData: any) =>
  api.post(`/forms/${id}/submissions`, { values: submissionData }).then((res: any) => res.data);

export const validateRoute = (route: string, excludeId?: string) =>
  api.get(`/forms/validate-route/${route}`, { params: { exclude_id: excludeId } }).then((res: any) => res.data);

export default api;
