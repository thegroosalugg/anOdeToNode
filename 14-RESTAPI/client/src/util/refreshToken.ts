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
      const { JWTaccess, JWTrefresh } = token;
      localStorage.setItem('jwt-access',  JWTaccess);
      localStorage.setItem('jwt-refresh', JWTrefresh);
      return JWTaccess;
    } else {
      localStorage.removeItem('jwt-access');
      localStorage.removeItem('jwt-refresh');
    }
  }
};

export default refreshToken;
