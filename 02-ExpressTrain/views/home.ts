import Card from '../models/Card';

const homeCSS = /*css*/ `
  .home {
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    text-align: center;
    color: #000000;
  }
  .home h1 {
    text-shadow: 0.5px 0.5px 1px #000;
    font-size: 1.5rem;
  }
  .home ul {
    text-align: start;
  }
`;

// prettier-ignore
const locations = {
  a: '✈️', b: '🏖️', c: '🏛️', d: '🏔️', e: '🗽', f: '🎡', g: '🌳', h: '🏠', i: '🗼',
  j: '⛩️', k: '🏰', l: '🌌', m: '🗺️', n: '🏜️', o: '🗼', p: '🏛️', q: '⚓', r: '🚀',
  s: '☀️', t: '🚂', u: '☔️', v: '🌋', w: '🌊', x: '🏛️', y: '🛥️', z: '🏛️',
};

const home = (cards: Card[]) => /*html*/ `
  <section class='home'>
    <h1>You are Home</h1>
    <ul>
      ${cards
        .map(
          (cards) =>
            `<li>${
              (locations[cards.name[0].toLowerCase() as keyof typeof locations] || '❓') +
              cards.name
            }</li>`
        )
        .join('')}  <!-- join removes commas -->
    </ul>
  </section>
`;

export { homeCSS, home };
