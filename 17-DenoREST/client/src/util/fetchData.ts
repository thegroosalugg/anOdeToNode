export interface Fetch {
      url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: FormData | Record<string, unknown>;
}

export type FetchError = {
  [key: string]: string;
} & {
  message: string;
   status: number;
};

export const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const fetchData = async ({ url, method = 'GET', data }: Fetch) => {
  const     body = data ? JSON.stringify(data) : null;
  const  headers = { "Content-Type": "application/json" };
  const response = await fetch(BASE_URL + url, { method, headers, body });
  const  resData = await response.json();

  console.log('ResData', resData);

  if (!response.ok) {
    throw { ...resData, status: response.status } as FetchError;
  }

  return resData;
};
