import Item from "../models/Item";
import navTo from "../util/navTo";

const cartCSS = /*css*/ `
  .cart {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #000000;

    * {
      font-weight: 500;
    }

    ul {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      width: 100%;
      max-width: 400px;
      max-height: 80%;
      overflow-y: scroll;
      padding: 1rem;

      li {
        display: flex;
        justify-content: space-between;
        border: 1px solid #d2851a;

        img {
          height: 75px;
          width: 75px;
          object-fit: cover;
          background: #000000;
          cursor: pointer;
        }
      }
    }

    h3 {
      flex: 1;
    }
  }

`;

const cartButton = (id: string, type: 'add' | 'remove') => /*html*/ `
  <form class="form" action="/cart/${type}" method="post">
    <input type="hidden" name="itemId" value="${id}" />
    <button>
      <i class="fa-solid fa-${type === 'add' ? 'plus' : 'minus'}"></i>
    </button>
  </form>
`;

const cartPage = (items: (Omit<Item, 'save'> & { quantity: number })[]) => {
  const cartTotal = items.reduce((total,  { price, quantity }) => total + price * quantity, 0).toFixed(2);

  return /*html*/ `
    <section class="cart">
      <h1>Your Cart</h1>
      <ul>
        ${items
          .map(
            ({ id, name, imgURL, price, quantity }) => /*html*/ `
              <li>
                <img src="${imgURL}" alt="${name}" onClick="${navTo('/store/' + id)}" />
                <h2>${name}</h2>
                <p>$${(quantity * price).toFixed(2)}</p>
                ${cartButton(id, 'remove')}
                <p>${quantity}</p>
                ${cartButton(id, 'add')}
              </li>
            `
          )
          .join('')}  <!-- join removes commas -->
      </ul>
      <h3>$${cartTotal}</h3>
    </section>
  `;
};

export { cartCSS, cartPage };
