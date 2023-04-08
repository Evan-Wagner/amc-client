import axios from 'axios';
import env from 'react-dotenv';

const api = axios.create({
    baseURL: env.REACT_ENV === 'dev' ? `http://localhost:${env.SERVER_PORT}` : `https://7oue4pv22c.execute-api.us-east-2.amazonaws.com`,
});

export const insertTune = payload => api.post(`/tunes`, payload);
export const getAllTunes = () => api.get(`/tunes`);
export const updateTuneById = (id, payload) =>
  api
    .put(`/tune/${id}`, payload)
    .then((response) => response.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || 'Tune update failed';
      throw new Error(errorMessage);
    });
export const deleteTuneById = id => api.delete(`/tunes/${id}`);
export const getTuneById = id => api.get(`/tunes/${id}`);
