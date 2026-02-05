import Logger from "@/models/Logger";
import { getAccessToken, getRefreshToken, refreshToken } from "./token";

export type ApiError = {
  [key: string]: string;
} & {
  message: string;
   status: number;
};

export interface Fetch {
      url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
    data?: FormData | Record<string, unknown>;
}

export const API_URL = import.meta.env.VITE_SERVER_URL;

const fetchData = async ({ url, method = "GET", data }: Fetch) => {
  const isFile = data instanceof FormData; // multipart/form-data
  const body   = data ? (isFile ? data : JSON.stringify(data)) : null;
  const headers: HeadersInit = {};
  if (!isFile) headers["Content-Type"] = "application/json";

  const makeRequest = async () => {
    const token = url.startsWith("refresh-token") ? getRefreshToken() : getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(API_URL + url, { method, headers, body });
  };

  let response = await makeRequest();

  if (response.status === 401 && headers.Authorization) {
    const newToken = await refreshToken();
    if (newToken) response = await makeRequest();
  }

  const resData  = await response.json();

  const config = Logger.getKeyFromUrl(url);
  const logger = new Logger(config);
  logger.res(response, resData, { method, url });

  if (!response.ok) {
    throw { ...resData, status: response.status } as ApiError;
  }

  return resData;
};

export default fetchData;
