import User from "@/models/User";
import { FetchState } from "./fetch";

export type Auth = FetchState<User | null, "user">
export interface Authorized extends Auth {
  user: User;
}

export type UserState = Pick<Authorized, "user" | "setUser">;
