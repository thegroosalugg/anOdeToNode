const navCSS = /*css*/ `
  .nav {
    display: flex;
    align-items: center;
    gap: 1rem;
    overflow: auto;
    padding: 0.5rem 1rem;
    background: linear-gradient(to right, #203a43, #2c5364);

    h1 {
      color: #FFFFFF;
      font-size: 1.5rem;
      margin: 0 2rem;
      text-wrap: nowrap;
    }

    a {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.1rem;
      color: #FFFFFF;
      border-bottom: 1px solid transparent;
      transition: 0.8s ease;

      &:hover, &.active {
        color: #f5af19;
        border-color: #f5af19;
      }

      i {
        font-size: 1.5rem;
      }
    }
  }
`;

const navButton = ({
  isActive,
  href,
  icon,
  label,
}: {
  isActive: string | undefined;
  href: string;
  icon: string;
  label: string;
}) => /*html*/ `
  <a class='${isActive === href ? 'active' : ''}' href=${href}>
    <i class='${icon}'></i>
    <span>${label}</span>
  </a>
`;

const navBar = (isActive: string | undefined) => /*html*/ `
  <nav class='nav'>
    <h1>Cool Mountain</h1>
    ${navButton({ isActive, href: '/', icon: 'fa-solid fa-mountain-sun', label: 'Shop' })}
    ${navButton({
      isActive,
      href: '/admin/board',
      icon: 'fa-solid fa-person-snowboarding',
      label: 'New',
    })}
  </nav>
`;

export { navCSS, navBar };
