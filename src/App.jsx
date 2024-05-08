import { ThemeProvider } from "styled-components";
import "./App.css";
import { useState } from "react";
import { darkTheme, lightTheme } from "./theme";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import Forget from "./components/ForgetPassword/Forget";
import SetPassword from "./components/SetPasswordPage/SetPassword";
import Home from "./components/Home/Home";
import { useEffect } from "react";
import { setAuthToken } from "./utils";
import { profile } from "./axios/instance";
import { useDataLayerValues } from "./datalayer";
import Navbar from "./components/Navbar/Navbar";
import PageNoteFound from "./components/PageNotFound/PageNoteFound";
import Footer from "./components/Footer/Footer";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import TrendingProjects from "./components/TrendingProjects/TrendingProjects";
import ProjectDetails from "./components/ProjectDetails/ProjectDetails";
import Showprojects from "./components/Showprojects/Showprojects";
import ScrollToTop from "./components/ScrollComponent/ScrollToTop";
import Profile from "./components/Profile/Profile";
// import NewProfile from "./components/Profile/NewProfile";
import AddNewProject from "./components/AddNewProject/AddNewProject";
import VerifyEmailPage from "./components/VerifyEmailPage/VerifyEmailPage";
import Contributors from "./components/contributors/Contributors";
import ContributorList from "./components/contributors/ContributorList";
import SuccessPage from "./components/SuccessPage/SuccessPage";
import PaymentList from "./components/PaymentList/PaymentList";

function App() {
  const [theme, setTheme] = useState("light");
  const [{dashboard}, dispatch] = useDataLayerValues();
  console.log(dashboard);

  useEffect(() => {
    const loader = document.getElementById("pre-loader");

    if (localStorage.getItem("tokken")) {
      setAuthToken(localStorage.getItem("tokken"));
      getUser();
    } else {
      dispatch({
        type: "SET_AUTH",
        isAuthenticated: false,
      });
    }

    if (loader) {
      loader.remove();
    }
  }, [localStorage.getItem("tokken")]);

  const getUser = async () => {
    try {
      const user = await profile();

      console.log("profile-getuser", user.data);
      const data = {
        ...user,
        userid: user.data._id,
        fname: user.data.firstname,
        lname: user.data.lastname,
        email: user.data.email,
      };
      const isverifiedemail = user.data.email_acctivation.email_activated;

      dispatch({
        type: "SET_AUTH",
        isAuthenticated: true,
      });
      dispatch({
        type: "SET_USER",
        user: data,
      });
      dispatch({
        type: "SET_EMAIL_VERIFIED",
        isemailverified: isverifiedemail,
      });
    } catch (err) {
      console.log(err);
    }
  };


  const themeToggler = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <div className="App">
        <BrowserRouter>
          <ScrollToTop />
          <Navbar themeToggler={themeToggler} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route exact path="/projects" element={<Showprojects />} />
            <Route exact path="/trendings" element={<TrendingProjects />} />
            <Route
              exact
              path="/projectdetails/:projectid"
              element={<ProjectDetails />}
            />
            <Route exact path="/projectdetails/:userid/:projectid" element={<SuccessPage />} />
            <Route exact path="/profile/:profileid" element={<Profile />} />

            {/* AUTH ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgetpassword" element={<Forget />} />
            <Route path="/setnewpassword/:token" element={<SetPassword />} />

            {/* ADD NEW PROJECT ROUTES */}
            <Route exact path="/addnew" element={<AddNewProject />} />
            <Route exact path="/contributors-form" element={<Contributors />} />
            <Route exact path="/contributors" element={<ContributorList />} />
            <Route exact path="/payments" element={<PaymentList />} />
            
            {/* ADD NEW PROJECT ROUTES */}
            <Route
              exact
              path="/project-zone/verify-email/:tokenemail"
              element={<VerifyEmailPage />}
            />

            {/* Other routes  */}
            <Route exact path="/about" element={<About />} />
            <Route exact path="/contact" element={<Contact />} />
            <Route path="/*" element={<PageNoteFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
