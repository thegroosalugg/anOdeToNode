import User from "@/models/User";
import { RecordMap } from "../types/common";

const staticMeta: RecordMap<{ title: string; description: string }> = {
     "/feed": { title: "Feed", description: "All user posts" },
   "/social": { title: "Social", description: "List of users" },
    "/about": { title: "About", description: "About page" },
    "/terms": { title: "Terms & Conditions", description: "Terms & conditions page" },
  "/privacy": { title: "Privacy Policy", description: "Privacy policy page" },
};

export const getStaticMetadata = (path: string, user: User | null) => {
  if (path === "/") {
    return user
      ? { title: user.name, description: `${user.name}'s profile` }
      : { title: "Login", description: "Sign up page" };
  }

  return staticMeta[path] ?? { title: "", description: "" };
};

export const getDynamicMetadata = <T>(
  isLoading: boolean,
  data: T | null | undefined,
  getValues: (data: T) => { title: string; description: string },
  label: string,
) => {
  if (isLoading) return { title: "loading...", description: "loading" };
  if (data) return getValues(data);
  return { title: `${label} not found`, description: "Not found" };
};
