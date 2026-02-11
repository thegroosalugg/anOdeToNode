import User from "@/models/User";
import { ReqData } from "../hooks/useFetch";
import { ApiError } from "../http/fetchData";
import { SetData } from "./common";

// constrains K to string so it can be used in template literals
export type FetchState<T, K extends string = "data"> = {
  [P in `${K}`]: T;
} & { // P is a mapped type key; this maps to a single computed key name
  [P in `set${Capitalize<K>}`]: SetData<T>;
} & {
  [P in `req${Capitalize<K>}`]: ReqData<T>;
} & {
  isInitial: boolean;
  isLoading: boolean;
      error: ApiError | null;
   setError: SetData<ApiError | null>;
};

export type SetUser = SetData<User | null>;

export interface UserNullState {
       user: User | null;
    setUser: SetUser;
}

export interface UserState {
     user: User;
  setUser: SetUser;
};

export interface UserPair {
    target: User;
  watcher?: User;
}
