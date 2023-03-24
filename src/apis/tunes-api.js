import axios from 'axios';
import env from 'react-dotenv';

const api = axios.create({
    baseURL: env.REACT_ENV === 'dev' ? `http://localhost:${env.SERVER_PORT}/api` : `https://amc-server.vercel.app`,
});

export const insertTune = payload => api.post(`/tune`, payload);
export const getAllTunes = () => api.get(`/tunes`);
export const updateTuneById = (id, payload) => api.put(`/tune/${id}`, payload);
export const deleteTuneById = id => api.delete(`/tune/${id}`);
export const getTuneById = id => api.get(`/tune/${id}`);