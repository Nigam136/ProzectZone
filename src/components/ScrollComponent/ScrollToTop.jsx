import { useEffect } from "react";
// import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import {  useLocation } from "react-router-dom";

const ScrollToTop = () => {

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
  // useEffect(() => {
  //   const unlisten = history.listen(() => {
  //     window.scrollTo(0, 0);
  //   });
  //   return () => {
  //     unlisten();
  //   };
  // }, [history]);

  // return null;
};

ScrollToTop.propTypes = {
  history: PropTypes.object.isRequired,
};



export default ScrollToTop;
// export default withRouter(ScrollToTop);
