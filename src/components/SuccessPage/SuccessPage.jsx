import { useEffect, useState } from "react";
import { useDataLayerValues } from "../../datalayer";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ParticlesBg from "particles-bg";
import { GetSingleProject } from "../../axios/instance";

const SuccessPage = () => {
  const [{ user, ProjectDetails }, dispatch] = useDataLayerValues();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { userid, projectid } = useParams();

  console.log("dddddddd",ProjectDetails);
  console.log(user?.data);

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

  // const fetchProfile = async (id) => {
  //   setIsLoading(true);

  //   const body = {
  //     id: id,
  //   };

  //   try {
  //     const profileuser = await GetUserProfile(body);

  //     const dashboard_data = {
  //       id: profileuser.data._id,
  //       fname: profileuser.data.firstname,
  //       lname: profileuser.data.lastname,
  //       email: profileuser.data.email,
  //       bio: profileuser.data.profile.bio,
  //       description: profileuser.data.profile.description,
  //       profile_pic:
  //         profileuser?.data?.profile?.profile_pic &&
  //         profileuser.data.profile.profile_pic,
  //       projectones: profileuser.data.profile.projectones,
  //       projects_added: profileuser.data.profile.projects_added,
  //       projects_liked: profileuser.data.profile.projects_liked,
  //       projects_rated: profileuser.data.profile.projects_rated,
  //       followers: profileuser.data.profile.followers,
  //       following: profileuser.data.profile.following,
  //       badges: profileuser.data.profile.badges,
  //       social_links: profileuser.data.profile.social_links,
  //       created_at: profileuser.data.created_at,
  //     };

  //     dispatch({
  //       type: "SET_USER_DASHBOARD_DATA",
  //       dashboard: dashboard_data,
  //     });
  //   } catch (err) {
  //     if (err.response) {
  //       toast.error(`${err.response.data.error}`);
  //       navigate("/user-not-found");
  //     }
  //   }

  //   setIsLoading(false);
  // };

  useEffect(() => {
    window.scroll(0, 0);
    fetchProject(projectid);
    // fetchProfile(userid)
  }, []);

  return (
    <div className="project_details_container">
      <ToastContainer position="bottom-left" />
      <ParticlesBg type="coweb" bg={true} />
      <div className="details_card" id="details_card">
        <div className="success_pay_div   ">
          <div className="success_pay d-flex flex-column  align-items-center justify-content-center">
            <h1>Payment Successfull...</h1>
            <p className="">
              Thank you <b>{user?.data?.firstname}</b> for your payment. You will
              be gain access to the project <b>{ProjectDetails?.title}</b> details page shortly.
            </p>
            <h4 className="">You have subscribed for Standard plan.</h4>
            <h3 className="">Enjoy The benefits!</h3>
          </div>
        </div>
        <button type="submit" className="submitbtn" onClick={() =>navigate(`/projectdetails/${projectid}`)}>
          <span>{`Back To ${ProjectDetails?.title} Details`}</span>
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
