import cssReset from "../styles/cssReset";
import { navCSS, navBar } from "./navBar";

const bodyCSS = /*css*/`
  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: linear-gradient(to right, #d3cce3, #e9e4f0);
  }
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #FFFFFF;
  }
  a {
    transition: 0.8s ease;
  }
`;

interface html {
        css: string;
    content: string;
  isActive?: string;
}

const html = ({ css, content, isActive }: html ) => /*html*/`
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Express Train</title>
      <style>
        ${cssReset}
        ${bodyCSS}
        ${navCSS}
        ${css}
      </style>
    </head>
    <body>
      ${navBar(isActive)}
      <main>
        ${content}
      </main>
    </body>
  </html>
`;

export default html;
