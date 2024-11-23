const errorCSS = /*css*/`
  .error {
    margin: 2rem auto ;
    text-align: center;

    h1 {
      margin-bottom: 1rem;
      font-size: 1.5rem;
      text-shadow: 0.5px 0.5px 1px #000;
    }

    a {
      font-size: 1.2rem;
      color: #2c5364;

      &:hover {
        color: #77c8ed;
      }
    }
  }
`;

const errorPage = /*html*/`
  <div class='error'>
    <h1>Page Not Found</h1>
    <a href ='/'>Go back</a>
  </div>
`;

export { errorCSS, errorPage };
