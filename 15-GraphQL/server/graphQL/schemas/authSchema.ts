import { buildSchema } from "graphql";

export const authSchema = `#graphql
  type User {
      _id: ID!
     name: String!
    email: String!
  }

  type AuthData {
     JWTaccess: String!
    JWTrefresh: String!
           _id: ID!
          name: String!
         email: String!
  }

  input UserInputData {
        name: String!
       email: String!
    password: String!
  }

  type Query {
    login(email: String!, password: String!): AuthData!
  }

  type Mutation {
    signUp(userInput: UserInputData): AuthData!
  }
`;

// import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInputObjectType, GraphQLNonNull } from "graphql";
// import { authResolver } from "../resolvers/authResolver";

// // Input type for the signup data
// const UserInputType = new GraphQLInputObjectType({
//   name: "UserInput",
//   fields: {
//         name: { type: new GraphQLNonNull(GraphQLString) },
//        email: { type: new GraphQLNonNull(GraphQLString) },
//     password: { type: new GraphQLNonNull(GraphQLString) }
//   }
// });

// // Response type for signup data
// const UserAuthType = new GraphQLObjectType({
//   name: "UserAuth",
//   fields: {
//      JWTaccess: { type: GraphQLString },
//     JWTrefresh: { type: GraphQLString },
//            _id: { type: GraphQLString },
//           name: { type: GraphQLString },
//          email: { type: GraphQLString }
//   }
// });

// const query = new GraphQLObjectType({
//   name: "Query",
//   fields: {
//     login: {
//          type: UserAuthType,
//       resolve: () => ({}) // temporary placeholder
//     }
//   }
// });

// const mutation = new GraphQLObjectType({
//   name: "Mutation",
//   fields: {
//     signUp: {
//       type: UserAuthType,
//       args: {
//         userInput: { type: UserInputType }
//       },
//       resolve: (_, args) => {
//         // This will connect to resolver
//         return authResolver.Mutation.signUp(args, {});
//       }
//     }
//   }
// });

// export const authSchema = new GraphQLSchema({ query, mutation });
