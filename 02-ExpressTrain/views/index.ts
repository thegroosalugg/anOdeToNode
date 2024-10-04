const defaultCSS = `
  body {
    display: flex;
    background: linear-gradient(to right, #f7797d, #FBD786, #C6FFDD);
    margin: 0;
  }
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #FFFFFF;
  }
  a {
    text-decoration: none;
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
      <title>Express Train</title>
      <style>${defaultCSS}${contentCSS}</style>
    </head>
    <body>
      <main>
      ${content}
      </main>
    </body>
  </html>
`;

export default html;
