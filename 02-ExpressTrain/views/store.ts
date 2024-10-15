import Item from '../models/Item';
import navTo from '../util/navTo';

const storeCSS = /*css*/ `
  .store {
    display: flex;
    flex-direction: column;
    color: #000000;

    h1 {
      text-align: center;
      text-shadow: 0.5px 0.5px 1px #000;
      font-size: 1.5rem;
      font-weight: 200;
      padding: 1rem;
      background: #ff7f58;
    }

    ul {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin: 1rem;
      justify-content: center;

      li {
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
          object-fit: cover;
          cursor: pointer;
        }

        p {
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        > p {
          padding: 0 0.5rem 0.5rem;
          color: #878787;
        }

        > div {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;

          > p {
            &:first-child {
              max-width: 65%;
              font-weight: 600;
            }
            &:last-child {
              font-weight: 500;
              color: #3b3b3b;
            }
          }
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
            </li>
          `
        )
        .join('')}  <!-- join removes commas -->
    </ul>
  </section>
`;

export { storeCSS, store };
