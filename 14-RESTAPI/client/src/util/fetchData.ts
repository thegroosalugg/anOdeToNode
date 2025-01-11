import { captainsLog } from './captainsLog';
import refreshToken from './refreshToken';

export interface Fetch {
      url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: FormData | { [k: string]: FormDataEntryValue };
}

export const BASE_URL = import.meta.env.VITE_SERVER_URL;

const fetchData = async ({ url, method = 'GET', data }: Fetch) => {
  const isFile = data instanceof FormData; // multipart/form-data
  const   body = data ? (isFile ? data : JSON.stringify(data)) : null;
  const  token = localStorage.getItem('jwt-access');
  const headers: HeadersInit = {};
  if (!isFile) headers['Content-Type']  = 'application/json';
  if ( token ) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(BASE_URL + url, { method, headers, body });
  const resData  = await response.json();

  captainsLog(-100, 20, ['RES', response, 'RESData', resData]); // **LOGDATA

  if (!response.ok) {
    if (response.status === 401) {
      const newToken = await refreshToken(resData.refresh);
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        const retryResponse = await fetch(BASE_URL + url, { method, headers, body });
        return await retryResponse.json();
      }
    }
    throw { ...resData, status: response.status };
  }

  return resData;
};

export default fetchData;
