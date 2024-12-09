import User from "../models/User";

declare module "express-session" {
  interface SessionData {
    user?: InstanceType<typeof User> | null; // Extend the session data type to include `user`
  }
}
