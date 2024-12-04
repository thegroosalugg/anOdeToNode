import User from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: User | null; // add user prop to Express's default Request types
    }
  }
}
