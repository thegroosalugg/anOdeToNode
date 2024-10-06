const homeCSS = /*css*/`
  .home {
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  .home h1 {
    text-shadow: 0.5px 0.5px 1px #000;
    font-size: 1.5rem;
  }
`;

const locations = {
  a: '✈️', b: '🏖️', c: '🏛️', d: '🏔️', e: '🗽', f: '🎡', g: '🌳', h: '🏠', i: '🗼',
  j: '⛩️', k: '🏰', l: '🌌', m: '🗺️', n: '🏜️', o: '🗼', p: '🏛️', q: '⚓', r: '🚀',
  s: '☀️', t: '🚂', u: '☔️', v: '🌋', w: '🌊', x: '🏛️', y: '🛥️', z: '🏛️',
};

const home = (station: string) => /*html*/`
  <section class='home'>
    <h1>${
      station
        ? station + (locations[station[0].toLowerCase() as keyof typeof locations] || '❓')
        : 'You are Home 🏡'
    }</h1>
  </section>
`;

export { homeCSS, home };
