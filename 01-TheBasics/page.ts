const css = `
body {
  display: flex;
  background: linear-gradient(to right, #3a7bd5, #3a6073);
  margin: 0;
}
main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #FFFFFF;
}
img {
  width: 250px;
}
p {
  margin: 0.5rem;
}
form {
  display: flex;
}
button {
  background: #FF6500;
  color: #1E3E62;
  border: 1px solid #1E3E62;
  font-weight: 300;
}`;

const content = [
  `<h1>The Basics</h1>
  <p>Send a message</p>
  <form action='/message' method='POST'>
    <input name='message' />
    <button>Send</button>
  </form>
  <img src='/assets/nodejs.png' alt='Node JS icon' />`,

  `<h1>Page Not Found</h1>`
];

const html = (index: number) => `
<html>
  <head>
    <title>The Basics</title>
    <style>${css}</style>
  </head>
  <body>
    <main>
     ${content[index]}
    </main>
  </body>
</html>`;

export default html;
