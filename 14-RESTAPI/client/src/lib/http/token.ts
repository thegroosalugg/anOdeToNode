import User from "@/models/User";
import { API_URL } from "./fetchData";
import { api } from "./endpoints";

let accessToken: string;
export const setAccessToken = (t: string) => (accessToken = t);
export const getAccessToken = () => accessToken;

// simulate cookie storage: unable to use cookies as it would make the 3rd party
const storageKey = "jwt-refresh";
export const setRefreshToken = (t: string) => {
  localStorage.setItem(storageKey, t);
};

export const getRefreshToken = () => {
  const token = localStorage.getItem(storageKey);
  removeRefreshToken();
  return token;
};

export const removeRefreshToken = () => {
  localStorage.removeItem(storageKey);
}

export const saveTokens = (user: User) => {
  const { JWTaccess, JWTrefresh } = user;
  setAccessToken(JWTaccess);
  setRefreshToken(JWTrefresh);
};

export const refreshToken = async () => {
  const savedToken = getRefreshToken();
  if (!savedToken) return;

  const response = await fetch(API_URL + api.user.refresh({}), {
     method: "POST",
    headers: { Authorization: `Bearer ${savedToken}` },
  });

  const user = await response.json();
  if (!user) return;
  saveTokens(user);
  return true;
};
