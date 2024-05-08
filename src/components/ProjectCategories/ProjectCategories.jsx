import { useNavigate } from "react-router-dom";
import { useDataLayerValues } from "../../datalayer";
import "./ProjectCategories.css";
import { actions } from "../../reducer";
import python from "./../../assets/python.svg";
import reactjs from "./../../assets/react.svg";
import javascript from "./../../assets/javascript.svg";
import appdev from "./../../assets/android.svg";
import webdev from "./../../assets/web.svg";

const ProjectCategories = () => {
  const [{ query }, dispatch] = useDataLayerValues();
  const navigate = useNavigate();

  const handleOnclick = (e) => {
    dispatch({
      type: actions.SET_QUERY,
      query: e.target.value,
    });
    navigate("/projects");
  };
  

  return (
    <>
      <div className="warpper">
        <div className="title_categories">
          <h2>Explore Categories</h2>
        </div>
        <div className="categories-card">
          <div className="React-card allcard">
            <button className="expbtn" value="React" onClick={handleOnclick}>
              Explore
            </button>
            <div className="allcard-title">
              React
              <br />
              <span> Projects </span>
            </div>
            <img className="react" src={reactjs} alt="react" />
          </div>
          <div className="App-dev-card allcard">
            <button className="expbtn" value="android" onClick={handleOnclick}>
              Explore
            </button>
            <div className="allcard-title">
              App Dev
              <br />
              <span> Projects </span>
            </div>
            <img src={appdev} className="android" alt="android" />
          </div>
          <div className="Python-card allcard">
            <button className="expbtn" value="Python" onClick={handleOnclick}>
              Explore
            </button>
            <div className="allcard-title">
              Python
              <br />
              <span> Projects </span>
            </div>
            <img className="img" src={python} alt="python" />
          </div>
          <div className="JavaScript-card allcard">
            <button
              className="expbtn"
              value="JavaScript"
              onClick={handleOnclick}
            >
              Explore
            </button>
            <div className="allcard-title">
              JavaScript
              <br />
              <span> Projects </span>
            </div>
            <img className="js" src={javascript} alt="javascript" />
          </div>
          <div className="Webdev-card allcard">
            <button className="expbtn" value="MERN" onClick={handleOnclick}>
              Explore
            </button>
            <div className="allcard-title">
              Web Dev
              <br />
              <span> Projects </span>
            </div>
            <img className="img" src={webdev} alt="webdev" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectCategories;
