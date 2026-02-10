import Logger from "@/models/Logger";
import { getAccessToken, getRefreshToken, refreshToken } from "./token";
import { eventBus } from "../util/eventBus";

export type ApiError = {
  [key: string]: string;
} & {
  message: string;
   status: number;
};

export type ApiUrl = string | null;

export interface Fetch {
      url: ApiUrl;
  method?: "GET" | "POST" | "PUT" | "DELETE";
    data?: FormData | Record<string, unknown>;
}

export const API_URL = import.meta.env.VITE_SERVER_URL;

const error = (status: number, err: Record<string, unknown>) => ({ status, ...err }) as ApiError;

const fetchData = async <T>({ url, method = "GET", data }: Fetch): Promise<NonNullable<T>> => {
  if (!url) throw error(0, { message: "Missing URL" });

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
    else eventBus.emit("logout");
  }

  const resData  = await response.json();

  const config = Logger.getKeyFromUrl(url);
  const logger = new Logger(config);
  logger.res(response, resData, { method, url });

  if (!response.ok) throw error(response.status, resData);

  return resData;
};

export default fetchData;
