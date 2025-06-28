import axios from "axios";

export const api = axios.create({
  baseURL: process.env.BACKEND_API || "https://ava-hackathon-api.onrender.com/",
});
