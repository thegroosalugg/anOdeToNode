import Item from "../models/Item";

const cartCSS = /*css*/ `

`;

const cartPage = (items: (Omit<Item, 'save'> & { quantity: number })[]) => {

  return /*html*/ `

  `;
};

export { cartCSS, cartPage };
