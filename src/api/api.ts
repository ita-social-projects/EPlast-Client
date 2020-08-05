import axios from "axios";
import BASE_URL from "../config";
<<<<<<< HEAD
import AuthStore from '../stores/Auth';
=======
import AuthStore from '../stores/AuthStore';
>>>>>>> origin

interface HttpResponse {
  headers: any;
  data: any;
}

axios.interceptors.request.use(
  config => {
      const token = AuthStore.getToken() as string;
      if (token) {
          config.headers['Authorization'] = 'Bearer ' + token;
      }
      config.headers['Content-Type'] = 'application/json';
      return config;
  },
  error => {
      Promise.reject(error)
  });

const get = async (url: string, data?: any): Promise<HttpResponse> => {
    const response = await axios.get(BASE_URL + url, {
        params: data,
    });
    return response;
};

const post = async (url: string, data?: any) => {
    const response = await axios.post(BASE_URL + url, data, {
      headers: {
        "Accept": "application/json",
        "Content-Type": 'application/json',
      },
    });
    return response;
  };

const put = async (url: string, data?: any): Promise<HttpResponse> => {
    const response = await axios.put(BASE_URL + url, data, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
    });
    return response;
};

const remove = async (url: string, data?: any, options: any = {}): Promise<HttpResponse> => {
    const response = await axios.delete(BASE_URL + url, {
        ...options,
        params: data,
    });
    return response;

};
export default { get, post, put, remove};
