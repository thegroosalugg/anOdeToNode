import { Link } from "react-router-dom";
import css from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={css["footer"]}>
      <hr />
      <section>
        <h1>FriendFace</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </nav>
        <h1>M.E.R.N.</h1>
      </section>
      <hr />
      <section>
        <p>© 2025 Social Media Demo. All rights reserved.</p>
        <a
            href="https://github.com/thegroosalugg/anOdeToNode/tree/main/14-RESTAPI"
          target="_blank"
        >
          View Source Code
        </a>
        <p>Designed with React 18, Express 4, Mongoose 8 & Socket.IO</p>
      </section>
    </footer>
  );
}
