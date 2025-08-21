import axios from "axios";

const API = axios.create({
  baseURL: "https://expence-finance-tracker.onrender.com/api"
});

export default API;
