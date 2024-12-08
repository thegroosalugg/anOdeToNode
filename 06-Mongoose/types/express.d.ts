import User from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: InstanceType<typeof User> | null; // add user prop to Express's default Request types
    }
  }
}
