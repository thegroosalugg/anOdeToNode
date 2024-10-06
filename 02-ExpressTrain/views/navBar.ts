const navCSS = /*css*/`
  .nav {
    display: flex;
    gap: 1rem;
    padding: 0.5rem 1rem;
    background: linear-gradient(to right, #203a43, #2c5364);
  }
  .nav a {
    color: #FFFFFF;
    transition: 0.8s ease;
  }
  .nav a:hover, .nav a.active {
    color: #f5af19;
    border-bottom: 1px solid #f5af19;
  }
`;

const navBar = (isActive: string | undefined) => /*html*/`
  <nav class='nav'>
    <a class=${isActive === '/'        && 'active'} href='/'             >Home🏡   </a>
    <a class=${isActive === '/express' && 'active'} href='/express/train'>Express🚂</a>
  </nav>
`;

export { navCSS, navBar }
