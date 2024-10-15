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
  }
`;

const itemPage = (item: Item | undefined) => {

  if (!item) {
    return /*html*/ `<h1 class="not-found">The Item Doesn't Exist</h1>`
  }

  const { name, imgURL, desc, price } = item;

  return /*html*/ `
    <section class="snowboard-page">
      <div class="banner">
        <img src="/assets/snowboarder.png" alt="snowboarder" />
        <img src="/assets/mountain.png"    alt="mountain" />
      </div>
    </section>
  `;
}

export { itemPageCSS, itemPage };
