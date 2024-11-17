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

        .admin-controls {
          display: flex;

          button {
            flex-basis: 50%;
            padding: 0.2rem;
            background: transparent;
            border: none;
            border-top: 1px solid #474747;
            cursor: pointer;
            transition: 0.5s ease-in-out;

            &:first-child {
              border-right: 0.5px solid #474747;
            }

            &:last-child {
              border-left: 0.5px solid #474747;
            }

            &:hover {
              color: #fff3f3;
              background: #524e4e;
            }
          }
        }
      }
    }
  }

  @media screen and (min-width: 320px) and (max-width: 440px) and (min-resolution: 2dppx) and (orientation: portrait) {
    .store {
      ul {
        li {
          width: 125px;
          img {
            height: 125px;
          }
        }
      }
    }
  }
`;

const adminControls = (id: number) => /*html*/ `
  <form class="admin-controls" action="/admin/delete-item" method="post">
    <button type="button" onClick="${navTo(`/admin/edit-item/${id}/?edit=true`)}">EDIT</button>
    <button onclick="return confirm('Are you sure you want to delete this item?')">DELETE</button>
    <input type="hidden" name="itemId" value="${id}" />
  </form>
`;

const storePage = ({ items, isAdmin }: { items: Item[], isAdmin?: boolean }) => /*html*/ `
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
              ${isAdmin ? adminControls(id) : ''}
            </li>
          `
        )
        .join('')}  <!-- join removes commas -->
    </ul>
  </section>
`;

export { storeCSS, storePage };
