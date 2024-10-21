import cssReset from './cssReset';
import { navCSS, navBar } from './navBar';

const bodyCSS = /*css*/ `
  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: linear-gradient(to bottom, #f2fcfe, #ddf6fb, #c1f0f9, #92edff);
    font-family: 'Montserrat', sans-serif;
  }
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
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

const html = ({ css, content, title, isActive }: HTML) => /*html*/ `
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
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet"
      >
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
