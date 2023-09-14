import axios from "axios";
import { config } from "./config";

const { apiKey, apiUrl } = config();

export const $axios = axios.create({
  baseURL: apiUrl,
  params: { api_key: apiKey },
});
