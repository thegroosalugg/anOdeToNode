import { ParsedQs } from "qs";
import { Types } from 'mongoose';
import User from "../models/User";

type ReqQuery = string | ParsedQs | string[] | ParsedQs[]

declare module "express-session" {
  interface SessionData {
         user: InstanceType<typeof User> | null;
         csrf: string;
       errors: Object; // treated as opaque
     formData: Object;
    resetAuth: { token: ReqQuery, expiry: number, userId: Types.ObjectId };
  }
}
