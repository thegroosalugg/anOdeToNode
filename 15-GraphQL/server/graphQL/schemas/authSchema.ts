import { buildSchema } from 'graphql';

// unlike TS, ! = required. Without ! = optional
// ID is a placeholder for any unique id
export const authSchema = `#graphql
  type Query {
    hello: String
  }
`;
