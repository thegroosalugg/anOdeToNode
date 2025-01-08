import { BASE_URL } from './fetchData';

const refreshToken = async (refresh?: boolean) => {
  localStorage.removeItem('jwt-access');

  if (refresh) {
    const JWTrefresh = localStorage.getItem('jwt-refresh');
    const response = await fetch(BASE_URL + 'refresh-token', {
       method: 'POST',
      headers: { Authorization: `Bearer ${JWTrefresh}` },
    });

    const token = await response.json();
    if (token) {
      localStorage.setItem('jwt-access', token);
      return token;
    } else {
      localStorage.removeItem('jwt-refresh');
    }
  }
};

export default refreshToken;
