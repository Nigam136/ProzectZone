import { useState } from "react";
import { useDataLayerValues } from "../../datalayer";
import "./ProjectDetailCard.css"
import { toast } from "react-toastify";
import { AddBadge, AddLike, AddNewRating } from "../../axios/instance";
import { Rating } from "@material-ui/lab";
import CongratsBadgeScreen from "../CongratsBadgeScreen/CongratsBadgeScreen"
import { Helmet } from "react-helmet";
import ShareProject from "../ShareProject/ShareProject";
import { getSkillColor } from "../../utils";
import { Link } from "react-router-dom";
import { GitHub } from "@material-ui/icons";
import share_logo from "./../../assets/share.svg";
import FavoriteIcon from "@material-ui/icons/Favorite";

const ProjectDetailCard = () => {

  const [{ ProjectDetails, dashboard, isAuthenticated }, dispatch] =
    useDataLayerValues();
  const [shareopen, setshareopen] = useState(false);
  const [likescount, setLikesCount] = useState(ProjectDetails?.likes);
  const [liked, setLiked] = useState(
    dashboard?.projects_liked.indexOf(ProjectDetails?.id) !== -1
  );
  const [rated, setRated] = useState(
    dashboard?.projects_rated.indexOf(ProjectDetails?.id) !== -1
  );
  const [modalVisibility, setModalVisibility] = useState("false");
  const [ratinggiven, setRatingGiven] = useState(ProjectDetails?.rating);
  // const [sentDesc, setSentDesc] = useState( );
  const [newbadge,setNewBadge] = useState({
    title:"",
    badge_description: ""
  });

  

  const toggleModalVisibility = () =>
  {
    setModalVisibility(!modalVisibility);
  };

  const LikeBtnHandler = async () =>
  {
    if (!isAuthenticated)
    {
      return toast.error(`You have to login first`);
    }

    if (!liked)
    {
      setLiked(true);
      setLikesCount(likescount + 1);

      try
      {
        const data = {
          project_id: ProjectDetails.id,
          likes: likescount + 1,
        };

        const res = await AddLike(data);
        if (!res.data.error)
        {
          const projectdata = {
            ...ProjectDetails,
            likes: likescount + 1,
          };

          const userdata = {
            ...dashboard,
            projects_liked: [...dashboard.projects_liked, ProjectDetails.id],
          };

          dispatch({
            type: "SET_PROJECT_DETAILS",
            ProjectDetails: projectdata,
          });

          dispatch({
            type: "SET_USER_DASHBOARD_DATA",
            dashboard: userdata,
          });

          toast.success(`${ res.data.msg }`);
        }

        let badgedata = {};
        switch (dashboard.projects_liked.length + 1)
        {
          case 3: badgedata = { title: 'Bronze in liking', badge_description: 'Liked 10+ projects' }; break;
          case 6: badgedata = { title: 'Silver in liking', badge_description: 'Liked 50+ projects' }; break;
          case 10: badgedata = { title: 'Gold in liking', badge_description: 'Liked 100+ projects' }; break;
        }
        console.log("qwertyui",badgedata);
        if (Object.keys(badgedata).length !== 0)
        {
          console.log("qwertyui",badgedata);
          const res = await AddBadge(badgedata);
          if (!res.data.error)
          {
            const userdata = {
              ...dashboard,
              badges: [...dashboard.badges, res.data.data]
            }

            dispatch({
              type: "SET_USER_DASHBOARD_DATA",
              dashboard: userdata
            })

            setNewBadge(badgedata);
            toggleModalVisibility();

            toast.success(`${res.data.msg}`);
          }
        }

      } catch (err)
      {
        if (err.response)
        {
          toast.error(`${ err.response.data.error }`);
        }
      }
    }
  };

  const shareButtonHandler = () =>
  {
    setshareopen(!shareopen);
  };

  const newRatingHandler = async (event, ratingval) =>
  {
    if (!isAuthenticated)
    {
      return toast.error(`You have to login first`);
    }

    if (!rated)
    {
      setRated(true);
      setRatingGiven(ratingval);

      try
      {
        const data = {
          project_id: ProjectDetails.id,
          newrating: ratingval,
        };

        const res = await AddNewRating(data);
        if (!res.data.error)
        {
          const projectdata = {
            ...ProjectDetails,
            rating: res.data.data,
          };

          const userdata = {
            ...dashboard,
            projects_rated: [...dashboard.projects_rated, ProjectDetails.id],
          };

          dispatch({
            type: "SET_PROJECT_DETAILS",
            ProjectDetails: projectdata,
          });

          dispatch({
            type: "SET_USER_DASHBOARD_DATA",
            dashboard: userdata,
          });

          toast.success(`${ res.data.msg }`);
        }

        let badgedata = {};
        switch (dashboard.projects_rated.length + 1)
        {
          case 3  : badgedata =  { title: 'Bronze in rating', badge_description: 'Rated 10+ projects'}; break;
          case 6  : badgedata =  { title: 'Silver in rating', badge_description: 'Rated 50+ projects'}; break;
          case 10 : badgedata =  { title: 'Gold in rating', badge_description: 'Rated 100+ projects'};  break;
        }

        if (Object.keys(badgedata).length !== 0)
        {
          const res = await AddBadge(badgedata);
          if (!res.data.error)
          {
            const userdata = {
              ...dashboard,
              badges: [...dashboard.badges, res.data.data]
            }

            dispatch({
              type: "SET_USER_DASHBOARD_DATA",
              dashboard: userdata
            })

            setNewBadge(badgedata);
            toggleModalVisibility();

            toast.success(`${res.data.msg}`);
          }
        }
      } catch (err)
      {
        if (err.response)
        {
          toast.error(`${ err.response.data.error }`);
        }
      }
    }
  };

  return (
    <>
    <Helmet title={`Project Zone | ${ ProjectDetails.title ? ProjectDetails.title : "Fetching Project Details..." }`} />
     <div className="details_card">
      <div className="titleBox">
        <h1 className="title_">{ProjectDetails.title}</h1>
        <div className="like-share">
          <img
            src={share_logo}
            className="share-icon"
            alt="share-logo"
            onClick={shareButtonHandler}
          />
        </div>
      </div>
      {shareopen ? (
        <ShareProject
          title={ProjectDetails.title}
          id={ProjectDetails.id}
          style={{right : "10%", marginTop:"3rem"}}
        />
      ) : null}
      <h4 className="level_">{ProjectDetails.level} Level</h4>

       <div className="desc_html" dangerouslySetInnerHTML={{__html : ProjectDetails.descr }}></div>


      <div className="card-footer_">
        <div className="skills_">
          {ProjectDetails.skills &&
            ProjectDetails.skills.map((skill, ind) => (
              <div
                key={ind}
                style={{ backgroundColor: getSkillColor(skill) }}
                className="skill"
              >
                {skill}
              </div>
            ))}
        </div>
        <div className="adder_div">
          <h4 className="like_label_">Added By </h4>
          {ProjectDetails.adder_id ? 
           <Link to={`/profile/${ProjectDetails.adder_id}`}>
              <h2>{ProjectDetails.adder_fname}</h2>
           </Link>
           : <h2>{ProjectDetails.adder_fname}</h2>
          }
          {ProjectDetails.github ? (
            <a style={{ color: "black" }} target="_blank" href={ProjectDetails.github}>
              <GitHub />
            </a>
          ) : null}
        </div>
        <div className="rating_div">
          <h4 className="like_label_">
            {!liked ? "Give it a Like" : "You have liked this project"}
          </h4>
          <div className="like-share">
            <FavoriteIcon
              className={!liked ? "heart" : "liked-heart"}
              onClick={LikeBtnHandler}
            ></FavoriteIcon>{" "}
            <span className={!liked ? "" : "liked-heart"}>{likescount}</span>
          </div>
        </div>
        <div className="rating_div">
          <h4 className="rate_label_">
            {!rated ? "Rate Project" : "You have rated this project"}
          </h4>
          <Rating
            name="rating"
            size="large"
            precision={0.5}
            defaultValue={ratinggiven}
            value={ratinggiven}
            readOnly={rated}
            onChange={newRatingHandler}
          />
        </div>
       </div>
      </div>
      <CongratsBadgeScreen 
        newbadge={newbadge} 
        modalVisibility={modalVisibility} 
        toggleModalVisibility={toggleModalVisibility} 
      />
     </>
  )
}

export default ProjectDetailCard