const navCSS = /*css*/ `
  .nav {
    display: flex;
    align-items: center;
    gap: 1rem;
    overflow: auto;
    padding: 0.5rem 1rem;
    background: linear-gradient(to right, #151e28, #1183a0, #6dd5ed);

    h1 {
      color: #FFFFFF;
      font-size: 1.5rem;
      margin-right: 1rem;
      text-wrap: nowrap;
      font-weight: 500;
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
        color: #ff7f58;
        border-color: #ff7f58;
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
    ${navButton({ isActive, href: '/',            icon: 'fa-solid fa-mountain-sun',  label: 'Store' })}
    ${navButton({ isActive, href: '/admin/items', icon: 'fa-solid fa-user',          label: 'User' })}
    ${navButton({
      isActive,
      href: '/admin/add-item',
      icon: 'fa-solid fa-person-snowboarding',
      label: 'New',
    })}
    ${navButton({ isActive, href: '/cart',        icon: 'fa-solid fa-cart-shopping', label: 'Cart' })}
  </nav>
`;

export { navCSS, navBar };
