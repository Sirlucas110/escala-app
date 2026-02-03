import { useAuthStore } from "@/store/authStore";
import axios, { AxiosResponse } from "axios";

const Http = axios.create();

class Service {
  protected static Http = Http;
  protected static getData = getData;
}

function getData<T>(res: AxiosResponse<T>) {
  return res.data;
}

const isDevelopment = import.meta.env.MODE === 'development'
const myBaseUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_DEPLOY
Http.defaults.baseURL = myBaseUrl
Http.defaults.withCredentials = true

Http.interceptors.request.use((config) => {
  const csrf = useAuthStore.getState().setCsrfToken();

  if (csrf) {
    config.headers["X-CSRFToken"] = csrf;
  }

  return config;
});


export default Service;


