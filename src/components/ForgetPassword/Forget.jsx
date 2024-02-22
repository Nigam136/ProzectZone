import { Helmet } from "react-helmet";
import "./Forget.css";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import { Link } from "react-router-dom";
import forget from "../../assets/forget.png";
import { forgetpassword } from "../../axios/instance";

const Forget = () => {
  const [email, setemail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  console.log(isLoading);

  const submitHandler = (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      toast.error("Type a valid email");
      return;
    } else {
      setemail("");
      sendemail(email);
    }
  };

  const sendemail = async (email) => {
    const data = {
      email: email,
    };
    setIsLoading(true);
    try {
      const res = await forgetpassword(data);
      if (!res.data.error) {
        toast.success(`${res.data.msg}`);
      }

      setIsLoading(false);
    } catch (err) {
      if (err.response) {
        toast.error(`${err.response.data.error}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Helmet title="Project Zone | Forget Password" />
      <ToastContainer position="top-right" />
      <div className="forget">
        <ToastContainer position="bottom-left" />
        <form className="forgetform">
          <h1>Project Zone</h1>
          <div className="forminput">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              name="email"
              className="forget__input"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
          </div>
          <div className="remember_forgotpass">
            <Link to="/login" className="forgotpass">
              Remembered?
            </Link>
          </div>
          <div className="btns">
            <button className="forgetbtn" onClick={submitHandler}>
              Submit
            </button>
          </div>
        </form>
        <div className="forgetimage">
          <img src={forget} alt="forgetavatar" />
        </div>
      </div>
    </div>
  );
};

export default Forget;
