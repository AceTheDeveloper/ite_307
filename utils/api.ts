import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!, // must use NEXT_PUBLIC_ for frontend
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
