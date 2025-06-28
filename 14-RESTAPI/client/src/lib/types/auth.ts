import User from "@/models/User";
import { FetchError, SetData } from "./common";
import { ReqHandler } from "../hooks/useFetch";

type  isUser =       User | null;
type isError = FetchError | null;

export interface Auth {
       user: isUser;
    setUser: SetData<isUser>;
    reqUser: ReqHandler<isUser>;
  isLoading: boolean;
      error: isError;
   setError: SetData<isError>;
}

export interface Authorized extends Auth {
  user: User;
}
