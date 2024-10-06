import cssReset from '../styles/cssReset';
import { navCSS, navBar } from './navBar';

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
    color: #FFFFFF;
  }
  a {
    transition: 0.8s ease;
  }
`;

interface HTML {
        css: string;
    content: string;
      title: string;
  isActive?: string;
}

const html = ({ css, content, title, isActive }: HTML ) => /*html*/`
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <style>
        ${cssReset}
        ${bodyCSS}
        ${navCSS}
        ${css}
      </style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
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
