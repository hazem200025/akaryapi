import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://195.200.14.15:8800/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    // You can add other headers if needed
  },
});

export default apiRequest;