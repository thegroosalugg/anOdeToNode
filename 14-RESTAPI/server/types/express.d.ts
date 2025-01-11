import User from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user: InstanceType<typeof User> | null;
    }
  }

  interface JwtPayload {
    userId: string;
  }
}

export {}; // Explicitly marks the file as a module.
