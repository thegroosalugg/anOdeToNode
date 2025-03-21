import { authResolver } from "./resolvers/authResolver";
import { authSchema } from "./schemas/authSchema";

export const typeDefs = [authSchema];

export const resolvers = [authResolver];
