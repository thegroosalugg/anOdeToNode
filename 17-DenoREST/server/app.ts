// oak is the express of Deno
import { Application } from '@oak/oak';
import "jsr:@std/dotenv/load"; // imports directly from URLs, no installs needed
import { connect } from "./db/db_client.ts";
import msgRoutes from './routes/msgRoutes.ts'; // .ts extension cannot be omitted like in Node

const app = new Application();

await connect(); // connect Mongo

app.use(async ({ response }, next) => {
  response.headers.set('Access-Control-Allow-Origin', Deno.env.get('CLIENT_URL')!);
  response.headers.set(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  await next();
});

// error middleware needs to run before routes in Deno
app.use(async ({ response }, next) => {
  try {
    await next();
  } catch (err) {
    const { status, message } = err as Error & { status: number };
    response.status = status || 500;
    response.body   = { error: message };
    console.error(err);
  }
});

const routes = [msgRoutes];

routes.forEach((route) => { // each route requires 2 middlewares
  app.use(route.routes()); // handles routes methods: get/post/etc.
  app.use(route.allowedMethods()); // handles 404 not found & 405 method not allowed
});

app.listen({ port: 3000 });
