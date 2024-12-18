import { ParsedQs } from "qs";
import { Types } from 'mongoose';
import User from "../models/User";

type ReqQuery = string | ParsedQs | string[] | ParsedQs[]

declare module "express-session" {
  interface SessionData {
         user: InstanceType<typeof User> | null;
         csrf: string;
       errors: { name?: string, email?: string, password?: string };
     formData: { name?: string, email?: string };
    resetAuth: { token: ReqQuery, expiry: number, userId: Types.ObjectId };
  }
}
