import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDataLayerValues } from "../../datalayer";
import { ToastContainer, toast } from "react-toastify";
import { login } from "../../axios/instance";
import { Helmet } from "react-helmet";
import { Oval } from "react-loading-icons";
import loginavatar from "../../assets/loginavatar.svg";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [{ user, isAuthenticated }, dispatch] = useDataLayerValues();

  const [fields, setFields] = useState({ email: "", password: "" });
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };

  const { email, password } = fields;

  useEffect(() => {
    isAuthenticated && navigate("/");
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event) => {
    setIsLoading(true);
    const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    event.preventDefault();

    if (email === "") {
      toast.error("Please enter your email ");
      setIsLoading(false);
    } else if (!emailTest.test(email)) {
      toast.error("Please enter a valid email");
      setIsLoading(false);
    } else if (password === "") {
      toast.error("Please enter a secure password");
      setIsLoading(false);
    } else if (password.length < 6) {
      toast.error("Password should have at least 6 characters");
      setIsLoading(false);
    } else {
      clearData();
      setUserAuth(email, password);
    }
  };

  const clearData = () => {
    setFields({
      email: "",
      password: "",
    });
  };

  const setUserAuth = async (email, password) => {
    const userData = {
      ...user,
      email: email,
      password: password,
    };

    const body = {
      email: email,
      password: password,
    };

    try {
      const res = await login(body);

      if (!res.data.error) {
        localStorage.setItem("tokken", res.data.accesstoken);

        setIsLoading(false);

        dispatch({
          type: "SET_AUTH",
          isAuthenticated: true,
        });
        dispatch({
          type: "SET_USER",
          user: userData,
        });
      }
    } catch (err) {
      if (err.response) {
        setIsLoading(false);
        toast.error(`${err.response.data.error}`);
      }
    }
  };

  return (
    <div className="login">
      <Helmet title="Project Zone | Login" />
      <ToastContainer position="top-right" className="toast"/>
      <form className="loginform" onSubmit={handleSubmit}>
        <h1>Project Zone</h1>
        <p>Welcome back! Please login to your account</p>
        <div className="forminput">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email address"
            name="email"
            value={email}
            className="login__input"
            onChange={handleChange}
          />
        </div>
        <div className="forminput">
          <label htmlFor="password">Password</label>
          <input
            type={passwordShown ? "text" : "password"}
            id="password"
            placeholder="Enter password"
            name="password"
            value={password}
            className="login__input"
            onChange={handleChange}
          />
          <FontAwesomeIcon
            icon={passwordShown ? faEyeSlash : faEye}
            onClick={togglePasswordVisiblity}
          />
        </div>
        <div className="remember_forgotpass">
          <div>
            <label className="container">
              Remember Me
              <input type="checkbox" />
              <span className="checkmark"></span>
            </label>
          </div>
          <div>
            <Link to="/forgetpassword" className="forgotpass">
              Forgot Password?
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="loading_indicator">
            <Oval stroke={"#6f6ee1"} />
          </div>
        ) : null}

        <div className="btns">
          <button type="submit" className="loginbtn">
            Login
          </button>
          <Link to="/signup" className="signuplink">
            <button className="signupbtn">Sign Up</button>
          </Link>
        </div>
        {/* <div className="social_signin">
          <p>or login with</p>
          <p className="blue google" onClick={handleSocialLogin}>
            Google
          </p>
        </div> */}
      </form>
      <div className="loginimage">
        <img src={loginavatar} alt="loginavatar" />
      </div>
    </div>
  );
};

export default Login;
