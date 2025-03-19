import { buildSchema } from 'graphql';

// unlike TS, ! = required. Without ! = optional
// ID is a placeholder for any unique id
export const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;
