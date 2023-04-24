import axios from 'axios';
import env from 'react-dotenv';

const api = axios.create({
    baseURL: env.REACT_ENV === 'dev' ? `http://localhost:${env.SERVER_PORT}` : `https://7oue4pv22c.execute-api.us-east-2.amazonaws.com`,
});

export const insertList = payload => api.post(`/lists`, payload);
export const getAllLists = () => api.get(`/lists`);
export const updateListById = (id, payload) =>
  api
    .put(`/lists/${id}`, payload)
    .then((response) => response.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || 'List update failed';
      throw new Error(errorMessage);
    });
export const deleteListById = id => api.delete(`/lists/${id}`);
export const getListById = id => api.get(`/lists/${id}`);
