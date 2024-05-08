import { useEffect, useState } from "react";
import { useDataLayerValues } from "../../datalayer";
import { useNavigate } from "react-router-dom";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "react-toastify/dist/ReactToastify.css";
import FormControl from "@material-ui/core/FormControl";
import addprojectimg from "./../../assets/addprojectimg.png";
import { ToastContainer, toast } from "react-toastify";
import { Helmet } from "react-helmet";
import UploadIcon from "@material-ui/icons/CloudUploadOutlined";
import Quote from "@material-ui/icons/FormatQuoteOutlined";
import "./Contributors.css";
import { addContributor } from "../../axios/instance";

const Contributors = () => {
  const navigate = useNavigate();

  const [{ ProjectDetails, user, isAuthenticated }] = useDataLayerValues();

  console.log(ProjectDetails);
  console.log("USER.DATA", user.data);
  console.log("USERID", user.data?._id);

  useEffect(() => {
    !isAuthenticated && navigate("/login");
  }, [isAuthenticated, navigate]);

  const [name, setName] = useState(user.data?.firstname);
  const [email, setEmail] = useState(user.data?.email);
  const [requestMessage, setRequestMessage] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [projects, setProjects] = useState(null);
  const [projectDetails, setProjectDetails] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please enter name of requestor");
    } else if (!email) {
      toast.error("Please enter email of requestor");
    } else if (!requestMessage) {
      toast.error("Please enter request message");
    } else if (!experienceLevel) {
      toast.error("Please enter you experience");
    } else if (!projects) {
      toast.error("Please enter Projects you have worked on");
    } else if (!projectDetails) {
      toast.error("Please enter your project details");
    } else {
      sendNewRequest(
        name,
        email,
        requestMessage,
        experienceLevel,
        projects,
        projectDetails
      );
      clearData();
    }
  };

  const sendNewRequest = async (
    name,
    email,
    requestMessage,
    experienceLevel,
    projects,
    projectDetails
  ) => {
    const body = {
      user: user.data._id,
      name: name,
      email: email,
      requestMessage: requestMessage,
      experienceLevel: experienceLevel,
      numberOfProjects: projects,
      projectDetails: projectDetails,
    };

    try {
      const res = await addContributor(body);
      if (!res.data.error && res.data.message) {
        toast.success(res.data.message);
      }
    } catch (err) {
      if (err.response) {
        toast.error(`${err.response.data.error}`);
      }
    }
  };

  const clearData = () => {
    setName("");
    setEmail("");
    setRequestMessage("");
    setExperienceLevel("");
    setProjects(null);
    setProjectDetails("");
  };

  return (
    <>
      <Helmet title="Project Zone | Add New Project" />
      <div>
        <ToastContainer position="top-right" />
        <div className="addproject_wrapper">
          <form onSubmit={handleSubmit} className="addprojectform">
            <h1>Want To Be a Contributor?</h1>
            <FormControl fullWidth>
              <div className="forminput">
                <label htmlFor="title">
                  Requestor Name<span>*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter Requester' Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="forminput">
                <label htmlFor="title">
                  Requestor Email<span>*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter Requester' Email ID"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="forminput_textarea">
                {/* <label htmlFor="title">
                  Request Message<span>*</span>
                </label> */}
                <textarea
                  type="text"
                  id="title"
                  placeholder="Request Message *"
                  name="requestMessage"
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  required
                />
              </div>
              <div className="forminput">
                <label htmlFor="title">
                  Experience Level<span>*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Mention Experience Level"
                  name="experienceLevel"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  required
                />
              </div>
              <div className="forminput">
                <label htmlFor="title">
                  Total Projects<span>*</span>
                </label>
                <input
                  type="number"
                  id="title"
                  placeholder="Mention Projects have You Worked"
                  name="projects"
                  value={projects}
                  onChange={(e) => setProjects(e.target.value)}
                  required
                />
              </div>
              <div className="forminput">
                <label htmlFor="title">
                  Project Details<span>*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter Project details"
                  name="projectDetails"
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  required
                />
              </div>
            </FormControl>
            <button type="submit" className="submitbtn">
              <span>Send Request</span>
              <UploadIcon className="fa-upload" />
            </button>
          </form>
          <div className="quotesection">
            <div className="quotebox">
              <Quote />
              <div className="quotebox_quote">
                Coming together is a beginning, keeping together is progress,
                working together is success.
              </div>
              <div>
                <span className="dash">-</span>Henry Ford
              </div>
              <img
                src={addprojectimg}
                alt="addprojectimg"
                className="addprojectimg"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contributors;
