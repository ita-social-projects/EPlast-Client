import axios, { Canceler } from "axios";
import BASE_URL from "../config";
import AuthStore from '../stores/AuthStore';
import { createBrowserHistory } from 'history';
import { useHistory, Router, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

export const history = createBrowserHistory();
let cancel: Canceler;

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
  }
);

axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response.status === 401) {
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      })
      source.cancel();
      AuthStore.removeToken();
      history.push("/signin");
      window.location.reload();

    }
    return Promise.reject(err);
  }
);

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
export default { get, post, put, remove };
