export interface Fetch {
      url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: FormData | Record<string, string>;
}

export const BASE_URL = import.meta.env.VITE_SERVER_URL;

const fetchData = async ({ url, method = 'GET', data }: Fetch) => {
  const isFile = data instanceof FormData; // multipart/form-data
  const   body = data ? (isFile ? data : JSON.stringify(data)) : null;
  const headers: HeadersInit = {};
  if (!isFile) headers['Content-Type'] = 'application/json';

  const response = await fetch(BASE_URL + url, { method, headers, body });
  const resData  = await response.json();

  console.log('fetchData response:', response, '\n\n', 'resData', resData); // **LOGDATA

  if (!response.ok) {
    throw { ...resData, status: response.status };
  }

  return resData;
};

export default fetchData;
