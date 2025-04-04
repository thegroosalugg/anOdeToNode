// oak is the express of Deno
import { Application } from "@oak/oak";
import msgRoutes from "./routes/msgRoutes.ts";

const app = new Application();

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

routes.forEach(route => { // each route requires 2 middlewares
  app.use(route.routes()); // handles routes methods: get/post/etc.
  app.use(route.allowedMethods()); // handles 404 not found & 405 method not allowed
});

app.listen({ port: 3000 });
