export interface Fetch {
      url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const fetchData = async ({ url, method = 'GET' }: Fetch) => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };

  const response = await fetch(BASE_URL + url, {
    method,
    headers,
  });

  const resData = await response.json();

  if (!response.ok) {
    console.log('fetchData response:', response);
    // throw { ...resData, status: response.status };
  }

  return resData;
};

export default fetchData;
