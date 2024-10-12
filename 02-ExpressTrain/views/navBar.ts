const navCSS = /*css*/`
  .nav {
    display: flex;
    align-items: center;
    gap: 1rem;
    overflow: auto;
    padding: 0.5rem 1rem;
    background: linear-gradient(to right, #203a43, #2c5364);
  }
  .nav h1 {
    color: #FFFFFF;
    font-size: 2rem;
    margin: 0 2rem;
    text-wrap: nowrap;
  }
  .nav a {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
    color: #FFFFFF;
    transition: 0.8s ease;
  }
  .nav a:hover, .nav a.active {
    color: #f5af19;
    border-bottom: 1px solid #f5af19;
  }
  .nav i {
    font-size: 1.5rem;
  }
`;

const navBar = (isActive: string | undefined) => /*html*/`
  <nav class='nav'>
    <h1>Express Train</h1>
    <a class=${isActive === '/'         && 'active'} href='/'>
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a class=${isActive === '/add-card' && 'active'} href='/admin/card'>
      <i class="fa-solid fa-train"></i>
      <span>Express</span>
    </a>
  </nav>
`;

export { navCSS, navBar }
