import { clientOrder } from '../models/User';

const ordersCSS = /*css*/ `
  .orders {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 0 auto;
    padding: 1rem;
    width: 100%;
    max-width: 800px;
    max-height: 85vh;
    overflow-y: scroll;

    > li {
      padding: 0.5rem;
      border-radius: 3px;
      box-shadow: 2px 2px 4px #454545;
      background: linear-gradient(to right, #ece9e6, #ffffff);

      > h2 {
        color: #000C40;
        text-shadow: 0.5px 0.5px 1px #000;
        margin-bottom: 0.3rem;
      }

      > ul {
        max-height: 5rem;
        overflow: auto;
        text-wrap: nowrap;

        > li {
          width: 99%;
          display: grid;
          grid-template-columns: minmax(30px, 1fr) minmax(75px, 6fr) minmax(75px, 1fr) minmax(30px, 1fr) minmax(75px, 1fr);
          gap: 0.5rem;

          img {
            width: 30px;
            height: 30px;
            object-fit: contain;
            background: #fefefe;
            border-left: 0.5px solid #000;
            border-right: 0.5px solid #000;
          }

          p {
            text-align: end;

            &:nth-of-type(1) {
              text-align: start;
            }
          }
        }
      }
    }
  }
`;

const ordersPage = (orders: clientOrder[]) => /*html*/ `
  <ul class="orders">
    ${orders
      .map(
        (order) => /*html*/ `
          <li>
            <h2>Order ID: ${order.id}</h2>
            <ul>
              ${order.items
                .map(
                  ({ name, price, imgURL, orderItem }, index) => /*html*/ `
                    <li>
                      <img
                        src="${imgURL}"
                        alt="${name}"
                        style="border-top: ${
                          index === 0 ? '0.5px solid #000' : 'none'
                        }; border-bottom: ${
                          index === order.items.length - 1 ? '0.5px solid #000' : 'none'
                        };"
                    />
                      <p>${name}</p>
                      <p>$${price.toFixed(2)}</p>
                      <p>x ${orderItem.quantity}</p>
                      <p>$${(orderItem.quantity * price).toFixed(2)}</p>
                    </li>
                  `
                )
                .join('')}
            </ul>
          </li>
        `
      )
      .join('')}
  </ul>
`;

export { ordersCSS, ordersPage };
