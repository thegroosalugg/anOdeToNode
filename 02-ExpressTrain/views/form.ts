const formCSS = /*css*/`
  .form {
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .form label {
    text-shadow: 1px 1px 2px #000;
    font-size: 1.2rem;
  }
  .form section {
    display: flex;
  }
  .form button {
    padding: 0.2rem 0.3rem;
    background: #2980B9;
    color: #FFFFFF;
    border: 0.5px solid transparent;
    cursor: pointer;
    transition: 0.5s ease-in-out;
  }
  .form button:hover {
    background: #FBD786;
    color: #000;
    border-color: #000;
  }
`;

const form = /*html*/`
  <form action='/admin/add-board' method='post' class='form' >
    <label for='name'>The Express Train 🚂</label>
    <section>
      <input id='name' name='name' />
      <button>All Aboard</button>
    </section>
  </form>
`;

export { formCSS, form };
