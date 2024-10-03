const homeCSS = `
.home {
  margin: auto;
  display: flex;
  flex-direction: column;
  text-align: center;
  transform: scale(2);
}
.home h1 {
  margin: 0;
  text-shadow: 0.5px 0.5px 1px #000;
}
.home a {
  text-decoration: none;
  color: #FFFFFF;
  transition: 0.8s ease;
}
.home a:hover {
  color: #000;
}`;

const locations = {
  a: '✈️', b: '🏖️', c: '🏛️', d: '🏔️', e: '🗽', f: '🎡', g: '🌳', h: '🏠', i: '🗼',
  j: '⛩️', k: '🏰', l: '🌌', m: '🗺️', n: '🏜️', o: '🗼', p: '🏛️', q: '⚓', r: '🚀',
  s: '☀️', t: '🚂', u: '☔️', v: '🌋', w: '🌊', x: '🏛️', y: '🛥️', z: '🏛️',
};

const home = (station: string) => `
<section class='home'>
  <h1>${
    station
      ? station + (locations[station[0].toLowerCase() as keyof typeof locations] || '🔮')
      : 'You are Home 🏡'
  }</h1>
  <a href='/express-train'>Take the Express 🚂</a>
</section>`;

export { homeCSS, home };
