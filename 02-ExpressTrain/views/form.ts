const formCSS = /*css*/ `
  .form {
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;


    > section {
      display: flex;
      flex-direction: column;

      label {
        text-transform: capitalize;
      }

      input {
        border: 1px solid #000000;
      }

      textarea {
        resize: none;
      }
    }

    button {
      padding: 0.2rem 0.3rem;
      background: #2980B9;
      color: #FFFFFF;
      border: 0.5px solid transparent;
      cursor: pointer;
      transition: 0.5s ease-in-out;

      &:hover {
        color: #000000;
        background: #FBD786;
        border-color: #000000;
      }
    }
  }
`;

const input = (id: string, text?: boolean) => /*html*/ `
  <section>
    <label for=${id}>${id}</label>
    ${
      text
        ? `<textarea rows=5 id=${id} name=${id}>Add a description</textarea>`
        : `<input id=${id} name=${id} />`
    }
  </section>
`;

const form = /*html*/ `
  <form action='/admin/add-item' method='post' class='form' >
    ${input('name')}
    ${input('price')}
    ${input('description', true)}
    <button>Add +</button>
  </form>
`;

export { formCSS, form };
