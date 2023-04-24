import axios from 'axios';
import env from 'react-dotenv';

const api = axios.create({
    baseURL: env.REACT_ENV === 'dev' ? `http://localhost:${env.SERVER_PORT}` : `https://7oue4pv22c.execute-api.us-east-2.amazonaws.com`,
});

export const insertTrack = payload => api.post(`/tracks`, payload);
export const getAllTracks = () => api.get(`/tracks`);
export const updateTrackById = (id, payload) =>
  api
    .put(`/tracks/${id}`, payload)
    .then((response) => response.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || 'Track update failed';
      throw new Error(errorMessage);
    });
export const deleteTrackById = id => api.delete(`/tracks/${id}`);
export const getTrackById = id => api.get(`/tracks/${id}`);
