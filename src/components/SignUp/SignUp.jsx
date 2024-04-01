import { Link, useNavigate } from "react-router-dom";
import { useDataLayerValues } from "../../datalayer";
import { makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { signup } from "../../axios/instance";
import { ToastContainer, toast } from "react-toastify";
import { Helmet } from "react-helmet";
import signupavatar from "../../assets/signupavatar.svg";
import "./SignUp.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Oval } from "react-loading-icons";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "91vh",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignUp = () => {
  const classes = useStyles();
  console.log(classes);
  const navigate = useNavigate();
  const [{ user, isAuthenticated }, dispatch] = useDataLayerValues();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };

  useEffect(() => {
    isAuthenticated && navigate("/");
  }, [isAuthenticated, navigate]);

  const { firstName, lastName, email, password } = fields;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleSubmit = (event) => {
    setIsLoading(true);
    const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    event.preventDefault();

    if (firstName === "") {
      setIsLoading(false);
      toast.error("Please enter your First Name");
    } else if (lastName === "") {
      setIsLoading(false);
      toast.error("Please enter your Last Name");
    } else if (email === "") {
      setIsLoading(false);
      toast.error("Please enter your email ");
    } else if (!emailTest.test(email)) {
      setIsLoading(false);
      toast.error("Please enter a valid email");
    } else if (password === "") {
      setIsLoading(false);
      toast.error("Please enter a secure password");
    } else if (password.length < 6) {
      setIsLoading(false);
      toast.error("Password should have at least 6 characters");
    } else {
      clearData();
      setUserAuth(firstName, lastName, email, password);
    }
  };

  const clearData = () => {
    setFields({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
  };

  const setUserAuth = async (firstName, lastName, email, password) => {
    const userData = {
      ...user,
      fname: firstName,
      lname: lastName,
      email: email,
      password: password,
    };
    const body = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: password,
    };
    try {
      const res = await signup(body);
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
    <div className="signup">
      <Helmet title="Project Zone | Signup" />
      <div className="signupimage">
        <img src={signupavatar} alt="signupavatar" />
      </div>
      <ToastContainer position="top-right" />
      <form className="signupform" onSubmit={handleSubmit}>
        <h2>
          <span className="welcome"> Welcome to </span> Project Zone{" "}
        </h2>
        <div className="forminput">
          <label htmlFor="firstname">First Name</label>
          <input
            type="name"
            id="firstname"
            name="firstName"
            value={firstName}
            placeholder="Enter Your FirstName"
            onChange={handleChange}
          />
        </div>
        <div className="forminput">
          <label htmlFor="lastname">Last Name</label>
          <input
            type="name"
            id="lastname"
            name="lastName"
            value={lastName}
            placeholder="Enter Your LastName"
            onChange={handleChange}
          />
        </div>
        <div className="forminput">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            placeholder="Enter Your Email ID"
            onChange={handleChange}
          />
        </div>
        <div className="forminput">
          <label htmlFor="password">Password</label>
          <input
            type={passwordShown ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            placeholder="Enter Password"
            onChange={handleChange}
          />
          <FontAwesomeIcon
            icon={passwordShown ? faEyeSlash : faEye}
            onClick={togglePasswordVisiblity}
          />
        </div>

        {isLoading ? (
          <div className="loading_indicator">
            <Oval stroke={"#6f6ee1"} />
          </div>
        ) : null}

        <div className="btns">
          <button type="submit" className="signup-btn">
            Sign Up
          </button>
          <Link to="/login" className="loginlink">
            <button className="login-btn">Login</button>
          </Link>
        </div>
        {/* <div className="social_signin">
          <p>or signup with</p>
          <p className="blue google" onClick={handleSocialLogin}>Google</p>
        </div> */}
      </form>
    </div>
  );
};

export default SignUp;
