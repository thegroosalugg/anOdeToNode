const cssReset = `
  *, *::before, *::after {
    box-sizing: border-box;
  }
  * {
    margin: 0;
    padding: 0;
    text-decoration: none;
    list-style: none;
  }
  body {
    line-height: 1;
    -webkit-font-smoothing: antialiased;
  }
  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }
  input, textarea, select {
    outline: none;
    border-radius: 0;
  }
  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
    font-size: inherit;
    font-weight: 100;
  }
  span {
    display: inline-block;
  }
  #root, #__next {
    isolation: isolate;
  }

  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: transparent;
  }
`;

export default cssReset;
