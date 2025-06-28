import axios from "axios";

export const api = axios.create({
  baseURL: process.env.BACKEND_API || "http://localhost:3001/",
});
