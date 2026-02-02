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

Http.defaults.baseURL = "http://localhost:8000/api/escala";
Http.defaults.withCredentials = true

Http.interceptors.request.use((config) => {
  const csrf = useAuthStore.getState().csrftoken;

  if (csrf) {
    config.headers["X-CSRFToken"] = csrf;
  }

  return config;
});

export default Service;


