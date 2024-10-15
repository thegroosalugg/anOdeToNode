import Item from '../models/Item';

const itemPageCSS = /*css*/ `
  .item {
    display: flex;
    flex-direction: column;
    width: 200px;
    background: #fff4f4;
    box-shadow: 2.5px 2.5px 5px #474747;
    transition: 0.5s ease-in-out;

    &:hover {
      box-shadow: 5px 5px 10px #000000;
    }

    img {
      height: 200px;
      cursor: pointer;
    }

    p {
      font-weight: 400;
    }

    > div {
      display: flex;
      justify-content: space-between;
      padding: 0.3rem 0.3rem 0;

      > p {
        &:first-child {
          max-width: 65%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    > p {
      padding: 0 0.3rem 0.3rem;
    }
  }
`;

const itemPage = (item: Item | undefined) => {
  if (!item) {
    return /*html*/ `<h1>The Item Doesn't Exist</h1>`
  }

  const { name, imgURL, desc, price } = item;

  return /*html*/ `
    <div class="item">
      <img src="${imgURL}" alt="${name}" />
      <div>
        <p>${name}</p>
        <p>$${price.toFixed(2)}</p>
      </div>
      <p>${desc}</p>
    </div>
  `;
}

export { itemPageCSS, itemPage };
