// create a serve with deno
function handler(_req: Request): Response {
  return new Response("wHat's uP?", { status: 200 });
};

// deno run --allow-net app.ts
Deno.serve({ port: 3000 }, handler);

// how to write files
const    text = 'This is a Test ' + Math.random();
const encoder = new TextEncoder();
const    data = encoder.encode(text);

// deno run --allow-write app.ts
Deno.writeFile('message.txt', data).then(() => console.log(text));
