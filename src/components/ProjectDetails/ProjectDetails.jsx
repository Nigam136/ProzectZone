import { Link, useNavigate, useParams } from "react-router-dom";
import "./ProjectDetails.css";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ProjectDetailCard from "../ProjectDetailCard/ProjectDetailCard";
import { BallTriangle } from "react-loading-icons";
import { ToastContainer, toast } from "react-toastify";
import ParticlesBg from "particles-bg";
import { useEffect, useState } from "react";
import { useDataLayerValues } from "../../datalayer";
import {
  AddComment,
  GetSingleProject,
  Payment,
  UpvoteComment,
  getPaymentByID,
} from "../../axios/instance";
import { loadStripe } from "@stripe/stripe-js";

const ProjectDetails = () => {
  const [{ user, ProjectDetails, dashboard, isAuthenticated }, dispatch] =
    useDataLayerValues();
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setcomment] = useState("");
  const [paid, setPaid] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const navigate = useNavigate();
  const { projectid } = useParams();
  const userid = user?.data?._id;

  console.log("user", user.data);
  console.log("user role", user.data.role);
  console.log("user", userid);

  useEffect(() => {
    window.scroll(0, 0);
    fetchProject(projectid);
  }, []);

  useEffect(() => {
    window.scroll(0, 0);
    fetchProjectByID(projectid, userid);
  }, []);

  const fetchProjectByID = async (projectid, userid) => {
    setIsLoading(true);

    const body = {
      project_Id: projectid,
      user_Id: userid,
    };

    try {
      const project = await getPaymentByID(body);

      if (project) {
        setPaid(project.data.isPaid);
        setPaymentData(project.data);
      }
      console.log("payment project state: ", paymentData);
    } catch (err) {
      if (err.response) {
        toast.error(`${err.response.data.error}`);
        navigate("/project-not-found");
      }
    }

    setIsLoading(false);
  };

  const fetchProject = async (id) => {
    setIsLoading(true);

    const body = {
      id: id,
    };

    try {
      const project = await GetSingleProject(body);

      dispatch({
        type: "SET_PROJECT_DETAILS",
        ProjectDetails: {
          id: project.data._id,
          title: project.data.name,
          descr: project.data.description,
          level: project.data.level,
          skills: project.data.skills,
          rating: project.data.rating,
          likes: project.data.likes,
          comments: project.data.comments,
          github: project.data.github,
          adder_id: project.data.adder_id,
          adder_fname: project.data.adder_fname,
        },
      });
    } catch (err) {
      if (err.response) {
        toast.error(`${err.response.data.error}`);
        navigate("/project-not-found");
      }
    }

    setIsLoading(false);
  };

  const CommentBtnHandler = async () => {
    if (!isAuthenticated) {
      return toast.error(`You have to login first`);
    }

    if (comment?.trim() === "") {
      return toast.error(`Type a valid comment`);
    }

    const data = {
      project_id: ProjectDetails.id,
      fname: user.fname,
      data: comment,
    };

    try {
      const comment_add = await AddComment(data);
      const comments_new = comment_add.data.data;
      const projectdata = {
        ...ProjectDetails,
        comments: comments_new,
      };

      setcomment("");
      dispatch({
        type: "SET_PROJECT_DETAILS",
        ProjectDetails: projectdata,
      });

      toast.success(`${comment_add.data.msg}`);
    } catch (err) {
      if (err.response) {
        toast.error(`${err.response.data.error}`);
      }
    }
  };

  const UpvoteHandler = async (comment_id, upvotes) => {
    if (!isAuthenticated) {
      return toast.error(`You have to login first`);
    }

    try {
      const data = {
        project_id: projectid,
        comment_id: comment_id,
        upvotes: upvotes + 1,
      };

      const res = await UpvoteComment(data);
      if (!res.data.error) {
        const comments_upvoted = res.data.data;
        const projectdata = {
          ...ProjectDetails,
          comments: comments_upvoted,
        };

        const userdata = {
          ...dashboard,
          comments_upvoted: [...dashboard.comments_upvoted, comment_id],
        };

        dispatch({
          type: "SET_PROJECT_DETAILS",
          ProjectDetails: projectdata,
        });

        dispatch({
          type: "SET_USER_DASHBOARD_DATA",
          dashboard: userdata,
        });

        toast.success(`${res.data.msg}`);
      }
    } catch (err) {
      if (err.response) {
        toast.error(`${err.response.data.error}`);
      }
    }
  };

  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51PASiZSDT5sbCxhUjIvJ6uZtMYzmqeK6WFtkdtg1bnPMziGps3JEojIlYtwzl1X7yS8fI3M5hFmTvdiINy6eoNl5004kup3lxW"
    );

    const data = {
      projectName: ProjectDetails.title,
      projectId: ProjectDetails.id,
      price: "400",
      userName: user.data.firstname,
      userId: user.data._id,
    };

    try {
      const response = await Payment(data);

      // const session = await response.json();
      // console.log(session);

      const sessionId = response.data.id;

      const result = stripe.redirectToCheckout({
        sessionId: sessionId,
      });
      console.log("pay results: ", result);

      toast.success(`${result.data.msg}`);
    } catch (err) {
      if (err.response) {
        toast.error(`${err.response.data.error}`);
      }
    }
  };

  return (
    <div className="project_details_container">
      <ToastContainer position="bottom-left" />
      <ParticlesBg type="coweb" bg={true} />
      {user.data.role === "admin" ? (
        <>
          {isLoading ? (
            <div className="loading__details">
              {" "}
              <BallTriangle color="#6f6ee1" stroke="#6f6ee1" />
            </div>
          ) : (
            <ProjectDetailCard />
          )}

          <div className="comment_section">
            <div className="comment_user_data">
              <h3> Add Your Suggestion </h3>
              <div className="comment_user">
                <div className="comment_user_name">
                  {user.fname ? user.fname : "Guest"}
                </div>
              </div>

              <div className="comment_inputbox">
                <textarea
                  placeholder="Enter your comment"
                  value={comment}
                  onChange={(e) => setcomment(e.target.value)}
                ></textarea>
              </div>
              <h4 className="comment_btn" onClick={CommentBtnHandler}>
                <h2>Comment</h2>
              </h4>
            </div>

            <div className="comment_header">
              <p> Comments : {ProjectDetails.comments?.length}</p>
            </div>

            <div className="comment_content">
              {ProjectDetails.comments &&
                ProjectDetails.comments.map((comment) => (
                  <div className="user_comment" key={comment._id}>
                    <div className="comment_info">
                      <div className="comment_user">
                        <Link to={`/profile/${comment.commenter_id}`}>
                          <h2>{comment.fname}</h2>
                        </Link>
                      </div>
                      <p className="comment_timestamp">{comment.createdat}</p>
                    </div>
                    <p className="comment_desc">{comment.data}</p>
                    <div>
                      {comment.upvotes &&
                      dashboard.comments_upvoted.indexOf(comment._id) !== -1 ? (
                        <>
                          <ThumbUpIcon className="thumb_upvote"></ThumbUpIcon>
                          <span className="upvotes upvotes_num">
                            {comment.upvotes}
                          </span>
                        </>
                      ) : (
                        <>
                          <ThumbUpIcon
                            className="thumb"
                            onClick={() =>
                              UpvoteHandler(comment._id, comment.upvotes)
                            }
                          ></ThumbUpIcon>
                          <span className="upvotes">
                            {comment.upvotes ? comment.upvotes : " "}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {(ProjectDetails?.level === "Intermediate"|| ProjectDetails?.level === "Advanced") && !paid ? (
            <div className="details_card" id="details_card">
              <h1>Standard Plan</h1>
              <p>For Individuals and Freelancers</p>
              <div className="payment_info pb-2 ">
                GET ACCESS AND BECOME THE PREMIUM USER 
              </div>
              <div className="payment_info pb-2 ">
                One Time Plan Only In
              </div>
              <h3><b>Rs. 400 /-</b></h3>
              <button
                type="submit"
                className="submitbtn mt-3"
                onClick={makePayment}
              >
                <span>Make Payment</span>
              </button>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="loading__details">
                  {" "}
                  <BallTriangle color="#6f6ee1" stroke="#6f6ee1" />
                </div>
              ) : (
                <ProjectDetailCard />
              )}

              <div className="comment_section">
                <div className="comment_user_data">
                  <h3> Add Your Suggestion </h3>
                  <div className="comment_user">
                    <div className="comment_user_name">
                      {user.fname ? user.fname : "Guest"}
                    </div>
                  </div>

                  <div className="comment_inputbox">
                    <textarea
                      placeholder="Enter your comment"
                      value={comment}
                      onChange={(e) => setcomment(e.target.value)}
                    ></textarea>
                  </div>
                  <h4 className="comment_btn" onClick={CommentBtnHandler}>
                    <h2>Comment</h2>
                  </h4>
                </div>

                <div className="comment_header">
                  <p> Comments : {ProjectDetails.comments?.length}</p>
                </div>

                <div className="comment_content">
                  {ProjectDetails.comments &&
                    ProjectDetails.comments.map((comment) => (
                      <div className="user_comment" key={comment._id}>
                        <div className="comment_info">
                          <div className="comment_user">
                            <Link to={`/profile/${comment.commenter_id}`}>
                              <h2>{comment.fname}</h2>
                            </Link>
                          </div>
                          <p className="comment_timestamp">
                            {comment.createdat}
                          </p>
                        </div>
                        <p className="comment_desc">{comment.data}</p>
                        <div>
                          {comment.upvotes &&
                          dashboard.comments_upvoted.indexOf(comment._id) !==
                            -1 ? (
                            <>
                              <ThumbUpIcon className="thumb_upvote"></ThumbUpIcon>
                              <span className="upvotes upvotes_num">
                                {comment.upvotes}
                              </span>
                            </>
                          ) : (
                            <>
                              <ThumbUpIcon
                                className="thumb"
                                onClick={() =>
                                  UpvoteHandler(comment._id, comment.upvotes)
                                }
                              ></ThumbUpIcon>
                              <span className="upvotes">
                                {comment.upvotes ? comment.upvotes : " "}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectDetails;
