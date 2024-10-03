export const formCSS = `
.form {
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  transform: scale(2);
}
.form label {
  text-shadow: 1px 1px 2px #000;
  font-size: 1.2rem;
}
.form section {
  display: flex;
}
.form input, .form input:focus {
  border-radius: 0;
  outline: none;
}
.form button {
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
}`

const form = `
<form action='/station' method='post' class='form' >
  <label for='station'>The Express Train 🚂</label>
  <section>
    <input id='station' name='station' />
    <button>All Aboard</button>
  </section>
<form/>`;

export default form;
