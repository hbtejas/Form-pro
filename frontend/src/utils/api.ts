import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const getForms = (teamId?: string) => 
  api.get('/forms', { params: { team_id: teamId } }).then((res: any) => res.data);

export const getForm = (idOrRoute: string) => 
  api.get(`/forms/${idOrRoute}`).then((res: any) => res.data);

export const createForm = (data: any) => 
  api.post('/forms', data).then((res: any) => res.data);

export const updateForm = (id: string, data: any) => 
  api.put(`/forms/${id}`, data).then((res: any) => res.data);

export const submitForm = (id: string, submissionData: any) => 
  api.post(`/forms/${id}/submit`, { data: submissionData }).then((res: any) => res.data);

export const validateRoute = (route: string, excludeId?: string) => 
  api.get(`/forms/validate-route/${route}`, { params: { exclude_id: excludeId } }).then((res: any) => res.data);

export default api;
