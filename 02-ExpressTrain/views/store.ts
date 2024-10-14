import Item from '../models/Item';
import navTo from '../util/navTo';

const storeCSS = /*css*/ `
  .store {
    margin: 1rem auto;
    display: flex;
    flex-direction: column;
    color: #000000;

    h1 {
      text-align: center;
      text-shadow: 0.5px 0.5px 1px #000;
      font-size: 1.5rem;
      margin-bottom: 1rem;
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
        background: #fff4f4;
        box-shadow: 2.5px 2.5px 5px #000000;

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
    }
  }
`;

const store = (items: Item[]) => /*html*/ `
  <section class="store">
    <h1>Mountain Store</h1>
    <ul>
      ${items
        .map(
          ({ id, name, desc, imgURL, price }) => /*html*/ `
          <li>
            <img src="${imgURL}" alt="${name}" onClick="${navTo('/store/' + id)}" />
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

export { storeCSS, store };
