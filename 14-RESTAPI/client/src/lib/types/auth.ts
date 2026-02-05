import User from "@/models/User";
import { FetchState } from "./fetch";
import { SetData } from "./common";

export type Auth = FetchState<User | null, "user">

export interface UserState {
     user: User;
  setUser: SetData<User | null>
};
