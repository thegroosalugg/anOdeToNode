import Order from '../models/Order';

const ordersCSS = /*css*/ `

`;

const ordersPage = (orders: Order[]) => {
  console.log(orders);

  return /*html*/ `
    <ul>
      ${orders
        .map(
          (order) => /*html*/ `
            <li>
              ${order.id}
            </li>
          `
        )
        .join('')}
    </ul>
  `;
};
export { ordersCSS, ordersPage };
