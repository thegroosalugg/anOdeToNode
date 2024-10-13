import Item from '../models/Item';

const shopCSS = /*css*/ `
  .shop {
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    color: #000000;

    h1 {
      text-align: center;
      text-shadow: 0.5px 0.5px 1px #000;
      font-size: 1.5rem;
    }

    ul {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;

      li {
        display: flex;
        flex-direction: column;
        width: 200px;

        img {
          height: 200px;
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
    }
  }
`;

const shop = (items: Item[]) => /*html*/ `
  <section class='shop'>
    <h1>Shop</h1>
    <ul>
      ${items
        .map(
          ({ name, desc, imgURL, price }) => /*html*/ `
          <li>
            <img src='${imgURL}' alt='${name}' />
            <div>
              <p>${name}</p>
              <p>$${price.toFixed(2)}</p>
            </div>
            <p>${desc}</p>
          </li>`
        )
        .join('')}  <!-- join removes commas -->
    </ul>
  </section>
`;

export { shopCSS, shop };
