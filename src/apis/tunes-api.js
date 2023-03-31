import axios from 'axios';
import env from 'react-dotenv';

const api = axios.create({
    baseURL: env.REACT_ENV === 'dev' ? `http://localhost:${env.SERVER_PORT}/api` : `http://3.141.170.90/api`,
});

export const insertTune = payload => api.post(`/tune`, payload);
export const getAllTunes = () => api.get(`/tunes`);
export const updateTuneById = (id, payload) =>
  api
    .put(`/tune/${id}`, payload)
    .then((response) => response.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || 'Tune update failed';
      throw new Error(errorMessage);
    });
export const deleteTuneById = id => api.delete(`/tune/${id}`);
export const getTuneById = id => api.get(`/tune/${id}`);