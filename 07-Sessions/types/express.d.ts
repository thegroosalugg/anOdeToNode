import User from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: InstanceType<typeof User> | null; // Use InstanceType to get the full type including methods
    }
  }
}
