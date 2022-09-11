import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_SERVER_URL}api`;
// const HOST = window.location.host;

export const axiosReq = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    origin: `https://langexchangeweb.netlify.app`,
  },
});
