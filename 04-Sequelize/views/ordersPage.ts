import { clientOrder } from '../models/User';

const ordersCSS = /*css*/ `

`;

const ordersPage = (orders: clientOrder[]) => {
  console.log(orders);

  return /*html*/ `
    <ul>
      ${orders
        .map(
          (order) => /*html*/ `
            <li>
              <p>Order ID: ${order.id}</p>
              <ul>
                ${order
                  .items.map(
                    ({ name, price, orderItem }) => /*html*/ `
                      <li>
                        <p>${name}</p>
                        <p>${price}</p>
                        <p>${orderItem!.quantity}</p>
                        <p>${orderItem!.quantity * price}</p>
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
};
export { ordersCSS, ordersPage };
