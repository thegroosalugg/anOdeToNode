import css from './styles'
import form from "./form";

const content = {
  form,
}

const html = (key: keyof typeof content) => `
<html>
  <head>
    <title>Express Train</title>
    <style>${css(key)}</style>
  </head>
  <body>
    <main>
     ${content[key]}
    </main>
  </body>
</html>`;

export default html;
