import cssReset from "../styles/cssReset";

const defaultCSS = `
  body {
    display: flex;
    background: linear-gradient(to right, #f7797d, #FBD786, #C6FFDD);
  }
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #FFFFFF;
  }
  a {
    color: #FFFFFF;
    transition: 0.8s ease;
  }
  a:hover {
    color: #000;
  }
`;

const html = (contentCSS: string, content: string) => `
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Express Train</title>
      <style>
        ${cssReset}
        ${defaultCSS}
        ${contentCSS}
      </style>
    </head>
    <body>
      <main>
        ${content}
      </main>
    </body>
  </html>
`;

export default html;
