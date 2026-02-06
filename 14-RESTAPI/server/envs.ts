import dotenv from 'dotenv';
dotenv.config();

const {
    CLIENT_URL,
  EXTERNAL_URL,
      NODE_ENV,
     MONGO_URI: mongo_uri,
    JWT_SECRET: jwt_secret,
   JWT_REFRESH: jwt_refresh,
} = process.env;

if (!mongo_uri || !jwt_secret || !jwt_refresh)
  throw new Error(
    `ENVs Missing: \n Mongo: ${Boolean(mongo_uri)} \n JWT secret: ${Boolean(jwt_secret)} \n JWT refresh: ${Boolean(jwt_refresh)}`,
  );

const [MONGO_URI, JWT_SECRET, JWT_REFRESH] = [mongo_uri, jwt_secret, jwt_refresh]; // narrows type to string. Removes potential undefined.

export { CLIENT_URL, EXTERNAL_URL, NODE_ENV, MONGO_URI, JWT_SECRET, JWT_REFRESH };
