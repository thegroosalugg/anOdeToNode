const text = 'This is a Test';
const encoder = new TextEncoder();
const data = encoder.encode(text);

Deno.writeFile('message.txt', data).then(() => console.log(text));
