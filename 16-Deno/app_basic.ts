// create a serve with deno
function handler(_req: Request): Response {
  return new Response("wHat's uP?", { status: 200 });
};

// deno run --allow-net app.ts
Deno.serve({ port: 3000 }, handler);
