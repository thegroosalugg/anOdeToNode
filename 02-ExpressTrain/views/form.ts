import Item from '../models/Item';

const formCSS = /*css*/ `
  .form {
    width: 100%;
    max-width: 400px;
    margin: 1rem auto 0;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background-image: url('/assets/logo1.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

    > h1 {
      background-image: url('/assets/inksplash.png');
      background-size: 100% 100%;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #ffffff;
      font-weight: 500;
      font-size: 1.5rem;
    }

    > section {
      display: flex;
      flex-direction: column;

      label, input, textarea {
        background: linear-gradient(to right, rgba(82, 81, 80, 0.85), rgba(234, 234, 234, 0.50));
        color: #ffffff;
        text-shadow: 1px 1px 2px #8c8c8c;
        font-size: 1.2rem;
        overflow-x: scroll;
      }

      label {
        padding: 0.2rem;
        text-transform: capitalize;
        border-radius: 3px 3px 0 0;
      }

      input {
        height: 2rem;
      }

      input, textarea {
        padding: 0.1rem 0.3rem;
        text-shadow: 1px 1px 2px #5f5f5f;
        border: none;
        border-top: 2px solid #ffffff;
        border-radius: 0 0 3px 3px;
        resize: none;
      }
    }

    button {
      padding: 0.2rem 0.3rem;
      font-size: 1.2rem;
      background: #1183a0;
      color: #FFFFFF;
      border: 0.5px solid transparent;
      border-radius: 3px;
      overflow-x: scroll;
      cursor: pointer;
      transition: 0.5s ease-in-out;

      &:hover {
        color: #000000;
        background: #ff7f58;
        border-color: #000000;
      }
    }
  }
`;

const input = (id: string, value: string, text?: boolean) => /*html*/ `
  <section>
    <label for=${id}>${id}</label>
    ${
      text
        ? `<textarea rows=5 id=${id} name=${id}>${value ? value : 'Add a description'}</textarea>`
        : `<input id=${id} name=${id} value="${value}" autocomplete='off' />`
    }
  </section>
`;

const form = (item?: Item) => {
  const { id = '', name = '', price = '', desc = '', imgURL = '' } = item || {};
  const backgroundImg = `/assets/logo${item ? 1 : 2}.png`;

  return /*html*/ `
    <form
      action="/admin/${item ? 'edit' : 'add'}-item"
      method="post"
      class="form"
      style="background-image: url('${backgroundImg}')"
    >
      <h1>${item ? 'Edit' : 'New'} Listing</h1>
      ${
        item
          ? /*html*/ `
            <input type="hidden" name="id"     value="${id}" />
            <input type="hidden" name="imgURL" value="${imgURL}" />
            `
          : ''
      }
      ${input('name', name)}
      ${input('price', price + '')}
      ${input('description', desc, true)}
      <button>
        ${
          item
            ? /*html*/ `Update <i class="fa-solid fa-check"></i>`
            : /*html*/ `Add    <i class="fa-solid fa-plus"></i>`
        }
      </button>
    </form>
  `;
};

export { formCSS, form };
