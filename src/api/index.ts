/* eslint-disable no-param-reassign */
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const HOST = process.env.NEXT_PUBLIC_BASE_URL;
const PATH = process.env.NEXT_PUBLIC_API_PATH;

export const baseURL = `${HOST}${PATH}`;

// const timeout = 3_600;

const defaultOptions = {
  baseURL,
};

const http = axios.create(defaultOptions);

const requestInterceptor = async (options: AxiosRequestConfig) => {
  return options;
};

const successResponseInterceptor = (response: AxiosResponse) => response;

const errorResponseInterceptor = async (err: AxiosError) => {
  return Promise.reject(err);
};

http.interceptors.request.use(requestInterceptor);
http.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor
);

export default http;
