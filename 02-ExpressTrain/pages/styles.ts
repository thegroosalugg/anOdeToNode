import { formCSS } from "./form";

const component = {
  form: formCSS,
}

const css = (key: keyof typeof component) => `
body {
  display: flex;
  background: linear-gradient(to right, #f7797d, #FBD786, #C6FFDD);
  margin: 0;
}
main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #FFFFFF;
}
${component[key]}`

export default css;
