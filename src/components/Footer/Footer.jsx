import { Link } from "react-router-dom";
import logo from "../Footer/icon.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="footerSection_">
        <div className="footer-top">
          <img src={logo} alt="logo" className="logo" />
          <h1 className="footerSection_title_"> Project Zone </h1>
        </div>
        <p>
          <a
            href="github"
            target="_blank"
            rel="noreferrer"
          >
            Made with❤️ by ProjectZone Developer
          </a>
        </p>
      </div>
      <div className="footerRight">
        <ul>
          <li>
            <Link to="/"> Home </Link>
          </li>
          <li>
            <Link to="/projects"> Find Projects </Link>
          </li>
          <li>
            <Link to="/login"> Login / Signup </Link>
          </li>
          <li>
            <Link to="/trendings"> Trending Projects </Link>
          </li>
          <li>
            <Link to="/contact"> Contact Us </Link>
          </li>
          <li>
            <Link to="/about"> About </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
