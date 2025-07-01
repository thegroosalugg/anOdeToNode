import { BASE_URL } from "./fetchData";

const refreshToken = async (shouldRefresh: boolean) => {
  localStorage.removeItem("jwt-access");
  if (!shouldRefresh) return;

  const JWTrefresh = localStorage.getItem("jwt-refresh");
  const response = await fetch(BASE_URL + "refresh-token", {
    method: "POST",
    headers: { Authorization: `Bearer ${JWTrefresh}` },
  });

  const token = await response.json();
  if (token) {
    const { JWTaccess, JWTrefresh } = token;
    localStorage.setItem("jwt-access", JWTaccess);
    localStorage.setItem("jwt-refresh", JWTrefresh);
    return JWTaccess;
  } else {
    localStorage.removeItem("jwt-access");
    localStorage.removeItem("jwt-refresh");
  }
};

export default refreshToken;
