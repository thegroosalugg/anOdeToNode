import Item from '../models/Item';

const itemPageCSS = /*css*/ `
  .not-found {
    margin: 5rem auto;
    padding: 0 1rem;
    text-align: center;
    font-size: 2rem;
    font-weight: 600;
  }

  .snowboard-page {
    flex: 1;
    background: #e0dcdc;

    .banner {
      background: linear-gradient(to right, #151e28, #30363e);
      position: relative;
      z-index: 1;
      overflow: hidden;

      img {
        margin: auto;

        &:first-of-type {
          width: 200px;
        }

        &:last-of-type {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          min-width: 1450px;
          z-index: -1;
        }
      }
    }

    .listing {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: center;
      padding: 1rem;

      > img {
        flex: 1 1;
        width: 100%;
        max-width: 400px;
        object-fit: contain;
        background-color: #000000;
        border: 1px solid #000000;
      }

      .info {
        flex: 1 1;
        width: 100%;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        border: 1px solid #000000;

        > h1 {
          font-size: 3rem;
          padding: 1rem 1rem 0.5rem 1rem;
          text-wrap: nowrap;
          overflow-x: scroll;
        }

        > p {
          max-height: 100px;
          overflow: auto;
          padding: 0 1rem;
          font-weight: 300;

          &::-webkit-scrollbar {
            width: 5px;
          }

          &::-webkit-scrollbar-thumb {
            background: #767676;
            border-radius: 10px;
          }
        }

        > h2 {
          color: #faf8f8;
          background: #8e1313;
          text-align: center;
          padding: 0.5rem 1rem;
          font-weight: 300;
        }

        .icons {
          display: flex;
          justify-content: space-evenly;
          overflow-y: hidden;
          overflow-x: scroll; /* if pushed out of viewport with web tools */

          i {
            padding: 0 1rem;
            color: #767676;
            border-right: 1px solid #767676;
            font-size: 2rem;
            text-align: center;
            display: flex;
            align-items: center;

            &:last-of-type {
              border: none;
            }
          }
        }

        .form {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: end;
          padding: 1rem;
          overflow: auto;

          > p {
            margin-top: auto;
            margin-bottom: 0.5rem;
            font-size: 1.5rem;
            font-weight: 500;
          }

          > button {
            padding: 1rem;
            border: 1px solid #767676;
            background: transparent;
            cursor: pointer;
            transition: 0.5s ease-in-out;

            &:hover {
              background: #d4cfcf;
            }
          }
        }
      }
    }
  }
`;

const itemPage = (item: Item | null) => {

  if (!item) {
    return /*html*/ `<h1 class="not-found">The Item Doesn't Exist</h1>`
  }

  const { id, name, imgURL, desc, price } = item;

  return /*html*/ `
    <section class="snowboard-page">
      <div class="banner">
        <img src="/assets/snowboarder.png" alt="snowboarder" />
        <img src="/assets/mountain.png"    alt="mountain" />
      </div>
      <div class="listing">
        <img src="${imgURL}" alt="${name}" />
        <div class="info">
          <h1>${name}</h1>
          <p>${desc}</p>
          <h2>Shred the Mountain</h2>
          <div class="icons">
              <i class="fa-regular fa-calendar"></i>
              <i class="fa-solid fa-mountain"></i>
              <i class="fa-solid fa-truck-fast"></i>
              <i class="fa-solid fa-users-between-lines"></i>
          </div>
          <form class="form" action="/cart/add" method="post">
            <p>$${price.toFixed(2)}</p>
            <button>Add to Cart</button>
            <input type="hidden" name="itemId" value="${id}" />
          </form>
        </div>
      </div>
    </section>
  `;
}

export { itemPageCSS, itemPage };
