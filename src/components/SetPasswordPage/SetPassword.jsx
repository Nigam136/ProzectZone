import { useState } from "react";
import "./SetPassword.css";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { SetNewPassword } from "../../axios/instance";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const SetPassword = () => {
  const [done, setDone] = useState(false);
  const { token } = useParams();

  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password.trim() === "") {
      return toast.error("Please valid password ");
    }
    if (password.length > 16 || password.length < 4) {
      return toast.error("password length must be between 4 to 16 characters");
    }
    if (confirmpassword.trim() === "") {
      return toast.error("Please valid password ");
    }
    if (confirmpassword.length > 16 || confirmpassword.length < 4) {
      return toast.error("password length must be between 4 to 16 characters");
    }
    if (password !== confirmpassword) {
      return toast.error("Password & Confirm password didn't match");
    } else {
      clearData();
      confirmPassword(password, confirmpassword);
    }
  };

  const clearData = () => {
    setpassword("");
    setconfirmpassword("");
  };

  const confirmPassword = async (password, cpassword) => {
    const data = {
      token: token,
      password: password,
      confirm_password: cpassword,
    };
    try {
      const res = await SetNewPassword(data);
      if (!res.data.err) {
        setDone(!done);
        toast.success(`${res.data.msg}`);
      }
    } catch (err) {
      if (err.response) {
        toast.error(`${err.response.data.error}`);
      }
    }
  };

  return (
    <div className="main">
      <Helmet title="Project Zone | Change Password" />
      <ToastContainer position="bottom-left" />
      <form className="passwordform" onSubmit={handleSubmit}>
        <div className="forminput">
          <label htmlFor="password">Password</label>
          <input
            type={passwordShown ? "text" : "password"}
            id="password"
            placeholder="Enter new password"
            name="password"
            value={password}
            className="login__input"
            onChange={(e) => setpassword(e.target.value)}
          />
          <FontAwesomeIcon
            icon={passwordShown ? faEyeSlash : faEye}
            onClick={togglePasswordVisiblity}
          />
        </div>
        <div className="forminput">
          <label htmlFor="password">Confirm Password</label>
          <input
            type={passwordShown ? "text" : "password"}
            id="confirmpassword"
            placeholder="Confirm your Password"
            name="confirmpassword"
            value={confirmpassword}
            className="login__input"
            onChange={(e) => setconfirmpassword(e.target.value)}
          />
          <FontAwesomeIcon
            icon={passwordShown ? faEyeSlash : faEye}
            onClick={togglePasswordVisiblity}
          />
        </div>
        <div className="btns">
          <button disabled={done} type="submit" className="btn">
            Done
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetPassword;
