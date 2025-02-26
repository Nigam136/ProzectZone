import { Helmet } from "react-helmet";
import "./PageNotFound.css";
import { Link } from "react-router-dom";

const PageNoteFound = () => {
  return (
    <div className="main_div">
      <Helmet title="Oops!! Page not found" />
      <section className="page_404">
        <div className="containerr">
          <div className="row">
            <div className="col-sm-12 ">
              <div className="col-sm-12 col-sm-offset-1  text-center">
                <div className="four_zero_four_bg">
                  <h1 className="text-center ">404</h1>
                </div>
                <div className="contant_box_404">
                  <h3 className="h2">Looks like you&apos;re lost</h3>
                  <p>The page you are trying to visit is not avaible!</p>
                  <Link to="/" className="link_404">
                    Go to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageNoteFound;
