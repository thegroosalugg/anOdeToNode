// oak is the express of Deno
import { Application } from "@oak/oak";
import msgRoutes from "./routes/msgRoutes.ts";

const app = new Application();

const routes = [msgRoutes];

routes.forEach(router => { // each route requires 2 middlewares
  app.use(router.routes()); // handles routes methods: get/post/etc.
  app.use(router.allowedMethods()); // handles 404 not found & 405 method not allowed
});

app.listen({ port: 3000 });
