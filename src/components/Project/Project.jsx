import { useState } from "react";
import "./Project.css";
import { useDataLayerValues } from "../../datalayer";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { AddBadge, AddLike } from "../../axios/instance";
import share_logo from "./../../assets/share.svg";
import cardimg from "./../../assets/cardtop.svg";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { GitHub } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { getSkillColor } from "../../utils";
import ShareProject from "../ShareProject/ShareProject";
import RatingCard from "../RatingCard/RatingCard";

const Project = (props) => {
  const [{ dashboard, isAuthenticated }, dispatch] = useDataLayerValues();

  const [shareopen, setshareopen] = useState(false);
  const [likescount, setLikesCount] = useState(props.likes);
  const [liked, setLiked] = useState(
    dashboard.projects_liked?.indexOf(props.id) !== -1
  );

  const shareButtonHandler = () => {
    setshareopen(!shareopen);
  };

  const LikeBtnHandler = async () => {
    if (!isAuthenticated) {
      return toast.error(`You have to login first`);
    }

    if (!liked) {
      setLiked(true);
      setLikesCount(likescount + 1);

      try {
        const data = {
          project_id: props.id,
          likes: likescount + 1,
        };

        const res = await AddLike(data);
        if (!res.data.error) {
          const userdata = {
            ...dashboard,
            projects_rated: [...dashboard.projects_rated, props.id],
          };

          dispatch({
            type: "SET_USER_DASHBOARD_DATA",
            dashboard: userdata,
          });

          toast.success(`${res.data.msg}`);
        }

        let badgedata = {};
        switch (dashboard.projects_liked.length + 1) {
          case 10:
            badgedata = {
              title: "Bronze in liking",
              badge_description: "Liked 10+ projects",
            };
            break;
          case 50:
            badgedata = {
              title: "Silver in liking",
              badge_description: "Liked 50+ projects",
            };
            break;
          case 100:
            badgedata = {
              title: "Gold in liking",
              badge_description: "Liked 100+ projects",
            };
            break;
        }

        if (Object.keys(badgedata).length !== 0) {
          const res = await AddBadge(badgedata);
          if (!res.data.error) {
            const userdata = {
              ...dashboard,
              badges: [...dashboard.badges, res.data.data],
            };

            dispatch({
              type: "SET_USER_DASHBOARD_DATA",
              dashboard: userdata,
            });

            toast.success(`${res.data.msg}`);
          }
        }
      } catch (err) {
        if (err.response) {
          toast.error(`${err.response.data.error}`);
        }
      }
    }
  };

  return (
    <div
      className="project"
      style={props.style && props.style}
      onDoubleClick={LikeBtnHandler}
    >
      <div className="cardimg-box">
        <img src={cardimg} className="cardimg" alt="card-image" />
      </div>
      <div className="card-content">
        <div className="title-flexbox">
          <h3 className="title"> {props.title}</h3>
          <img
            src={share_logo}
            className="share-img"
            alt="share-logo"
            onClick={shareButtonHandler}
          />
          {shareopen ? (
            <ShareProject id={props.id} title={props.title} description={props.desc} />
          ) : null}
        </div>
        <div className="descr">
          {props.desc.trim() == "" ? null : (
            <div
              className="description"
              dangerouslySetInnerHTML={{
                __html: props.desc.slice(0, 100) + "...",
              }}
            ></div>
          )}

          <Link to={`/projectdetails/${props.id}`}>
            <h5 className="read-more">Read more</h5>
          </Link>
        </div>

        <div className="level">
          <label>Level - </label>
          <p>{props.level}</p>
        </div>

        <div className="rating_div">
          <div className="like-share like-box">
            <FavoriteIcon
              className={!liked ? "heart" : "liked-heart"}
              onClick={LikeBtnHandler}
            ></FavoriteIcon>{" "}
            <span className={!liked ? "" : "liked-heart"}>{likescount}</span>
          </div>
          {props.github ? (
            <a style={{ color: "black" }} href={props.github}>
              <GitHub />{" "}
            </a>
          ) : null}
        </div>

        <div className="skills">
          {props.skills &&
            props.skills.map((skill, ind) => (
              <div
                key={ind}
                style={{ backgroundColor: getSkillColor(skill) }}
                className="skill"
              >
                {skill}
              </div>
            ))}
        </div>
        <div><RatingCard rating={props.rating} /></div>
      </div>
    </div>
  );
};

Project.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  skills: PropTypes.arrayOf(PropTypes.string).isRequired,
  level: PropTypes.string.isRequired,
  style: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  likes: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  comments: PropTypes.arrayOf(PropTypes.string).isRequired,
  github: PropTypes.string.isRequired,
};

export default Project;
