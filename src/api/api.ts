import axios from "axios";
import BASE_URL from "../config";

interface HttpResponse {
  headers: any;
  data: any;
}
const get = async (url: string, data?: any): Promise<HttpResponse> => {
    const response = await axios.get(BASE_URL + url, {
        params: data,
    });
    return response;
};
const post = async (url: string, data: any) => {
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

