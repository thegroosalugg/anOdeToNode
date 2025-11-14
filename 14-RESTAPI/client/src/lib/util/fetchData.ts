import Logger from '@/models/Logger';
import refreshToken from './refreshToken';
import { FetchError } from '../types/common';

type JSONbody =
  | FormData
  | { [k: string]: FormDataEntryValue | boolean | number | Record<string, unknown> };

export interface Fetch {
      url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: JSONbody;
}

export const BASE_URL = import.meta.env.VITE_SERVER_URL;

const fetchData = async ({ url, method = 'GET', data }: Fetch) => {
  const isFile = data instanceof FormData; // multipart/form-data
  const   body = data ? (isFile ? data : JSON.stringify(data)) : null;
  const headers: HeadersInit = {};
  if (!isFile) headers['Content-Type'] = 'application/json';

  const makeRequest = async () => {
    const token = localStorage.getItem('jwt-access');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch(BASE_URL + url, { method, headers, body });
  };

  let response = await makeRequest();
  let resData  = await response.json();

  if (response.status === 401) {
    const newToken = await refreshToken(resData.refresh);
    if (newToken) {
      response = await makeRequest();
      resData  = await response.json();
    }
  }

  const config = Logger.getKeyFromUrl(url);
  const logger = new Logger(config);
  logger.res(response, resData, { method, url });

  if (!response.ok) {
    throw { ...resData, status: response.status } as FetchError;
  }

  return resData;
};

export default fetchData;
