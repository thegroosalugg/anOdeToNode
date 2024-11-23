import CartItem from '../models/CartItem';
import Item from '../models/Item';
import navTo from '../util/navTo';

const cartCSS = /*css*/ `
  .cart {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    width: 100%;
    margin: 1rem auto;
    color: #e2e2e2;

    * {
      font-weight: 500;
    }

    .empty {
      font-size: 1.2rem;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    h1 {
      background-image: url('/assets/inksplash.png');
      background-size: 100% 100%;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-weight: 500;
      font-size: 1.5rem;
    }

    ul {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      max-height: 400px;
      overflow: auto;
      padding: 1rem;
      margin: 0 1rem;
      border-top: 1px solid #686868;
      border-bottom: 1px solid #686868;
      text-shadow: 1px 1px 2px #000000;

      li {
        min-height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow-y: hidden;
        overflow-x: scroll;
        background: #919191;
        border: 1px solid #000000;

        img {
          height: 80px;
          min-width: 80px;
          max-width: 80px;
          object-fit: cover;
          background: #000000;
          cursor: pointer;
        }

        h2 {
          min-width: 90px;
          font-size: 1rem;
          align-self: center;
          text-align: center;
          text-transform: uppercase;
          margin: 1rem;
        }

        .controls {
          display: flex;
          flex-direction: column;

          > p {
            font-size: 0.8rem;
            margin: 0.8rem 0.3rem 0 auto;
          }

          > div {
            margin: 1.5rem 0.3rem 0 auto;
            width: 80px;
            display: flex;
            align-items: center;
            gap: 0.4rem;

            > p {
              width: 15px;
              text-wrap: nowrap;
              text-align: center;
            }

            .form {
              button {
                color: #8e1313;
                background: linear-gradient(to right, #c1c5c6, #e8e8e8);
                border: 1px solid #8e1313;
                text-shadow: 0.5px 0.5px 1px #000000;
                box-shadow: 1px 1px 2px #000000;
                border-radius: 50%;
                padding: 0.2rem;
                font-size: 1rem;
                cursor: pointer;
              }
            }
          }
        }
      }
    }

    .order-button {
      padding: 0.5rem;
      padding-bottom: 0;

      button {
        width: 80%;
        height: 1.8rem;
        display: block;
        margin: auto;
        padding: 0.25rem;
        text-transform: uppercase;
        border: 1px solid #000;
        background: linear-gradient(to right, #0f2027, #203a43, #2c5364);
        color: #efefef;
        transition: 0.5s ease-in-out;

        &:hover {
          font-size: 1rem;
        }
      }
    }

    h3 {
        color: #000000;
        text-align: end;
        margin: 1rem;
    }
  }
`;

const cartButton = (id: number, type: 'add' | 'remove') => /*html*/ `
  <form class="form" action="/cart/${type}" method="post">
    <input type="hidden" name="itemId" value="${id}" />
    <button>
      <i class="fa-solid fa-${type === 'add' ? 'plus' : 'minus'}"></i>
    </button>
  </form>
`;

const cartPage = (items: (Item & { cartItem: CartItem })[]) => {
  let cartTotal = '0';

  if (items.length > 0) {
    cartTotal = items
      .reduce((total, { price, cartItem }) => total + price * cartItem.quantity, 0)
      .toFixed(2);
  }

  return /*html*/ `
    <section class="cart">
      <h1>Your Cart</h1>
      <ul>
        ${
          items.length === 0
            ? /*html*/ `<h4 class="empty">Your Cart is Empty</h4>`
            : items.map(
                ({ id, name, imgURL, price, cartItem }) => /*html*/ `
                  <li>
                    <img src="${imgURL}" alt="${name}" onclick="${navTo('/store/' + id)}" />
                    <h2>${name}</h2>
                    <div class="controls">
                      <div>
                        ${cartButton(id, 'remove')}
                        <p>${cartItem.quantity}</p>
                        ${cartButton(id, 'add')}
                      </div>
                      <p>$${(cartItem.quantity * price).toFixed(2)}</p>
                    </div>
                  </li>
                `
              )
            .join('')
        }  <!-- join removes commas -->
      </ul>
      ${
        items.length > 0
          ? /*html*/ `
          <form action="new-order" method="post" class="order-button">
            <button>Place Order</button>
          </form>
        `
          : ''
      }
      <h3>$${cartTotal}</h3>
    </section>
    <script>
      document.querySelector('main').style.backgroundColor = '#e0dcdc';
    </script>
  `;
};

export { cartCSS, cartPage };
