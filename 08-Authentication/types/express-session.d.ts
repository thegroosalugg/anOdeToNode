import User from "../models/User";

declare module "express-session" {
  interface SessionData { // Extend the session data type to include `user`
      user: InstanceType<typeof User> | null;
      csrf: string;
    errors: { email?: string, password?: string, name?: string };
  }
}
