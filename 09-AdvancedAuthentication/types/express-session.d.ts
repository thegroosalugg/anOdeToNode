import { ParsedQs } from "qs";
import { Types } from 'mongoose';
import User from "../models/User";

type ReqQuery = string | ParsedQs | string[] | ParsedQs[]

declare module "express-session" {
  interface SessionData { // Extend the session data type to include `user`
         user: InstanceType<typeof User> | null;
         csrf: string;
       errors: { email?: string, password?: string, name?: string };
    resetAuth: { token: ReqQuery, userId: Types.ObjectId };
  }
}
