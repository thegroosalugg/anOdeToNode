import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user: Types.ObjectId | null;
    }
  }

  interface JwtPayload {
    userId: string;
  }
}

export {}; // Explicitly marks the file as a module.
