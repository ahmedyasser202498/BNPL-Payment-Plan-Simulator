import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000/api/' });

export const loginApi = (data) => API.post('token/', data, );
export const signUpApi = (data) => API.post('signup/', data);
export const roleApi = (token) => API.get('role/',{ headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);
export const createPlanApi = (data,token) => API.post('plans/', data, { headers: { Authorization: `Bearer ${token}` } });
export const fetchPlansApi = (token) => API.get('plans/',{ headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);
export const payInstallmentApi = (id, token) => API.post(`installments/${id}/pay/`, null, {headers: { Authorization: `Bearer ${token}` }});
