import { Link} from "react-router-dom";
import PropTypes from "prop-types";
import "./CongratsBadgeScreen.css";
import ParticlesBg from "particles-bg";
import { getSkillColor } from "../../utils";

const CongratsBadgeScreen = ({
  newbadge,
  modalVisibility,
  toggleModalVisibility,
}) => {
   
  // console.log("badge screen",newbadge);
  // console.log("badge screen",modalVisibility);
  return (
    <>
      <div
        className={` badge_overlay ${
          modalVisibility && "badge_overlay_hidden"
        }`}
        onClick={() => toggleModalVisibility()}
      >
        <ParticlesBg type="fountain" bg={true} />
      </div>
      <div className={`badgemodal ${modalVisibility && "badgemodal_hidden"}`}>
        <h1>🌟 Congrats 🌟</h1>
        <h2> You Have Got a New Badge 😃</h2>
        <h2> Keep It Up 👍 </h2>
        <div className="badge_container">
          <i
            className={
              newbadge.badge_description
                .split(" ")
                .slice(0, 1)
                .includes("Liked")
                ? `fa fa-heart newfa`
                : newbadge.badge_description
                    .split(" ")
                    .slice(0, 1)
                    .includes("Rated")
                ? `fa fa-star newfa`
                : `fa fa-certificate newfa`
            }
            style={{
              color: getSkillColor(
                newbadge.title.split(" ").slice(0, 1).join(" ")
              ),
            }}
          ></i>
          <h2>{newbadge.title}</h2>
          <p>{newbadge.badge_description}</p>
        </div>
        <Link to="/profile" className="addnewlink profilelink">
          <button className="addnewbtn"> Go to Profile </button>
        </Link>
        <div
          className="badgemodal_closebar"
          onClick={() => toggleModalVisibility()}
        >
          <i className="fa fa-times"></i>
        </div>
      </div>
    </>
  );
};

CongratsBadgeScreen.propTypes = {
  newbadge: PropTypes.object.isRequired,
  modalVisibility: PropTypes.bool.isRequired,
  toggleModalVisibility: PropTypes.func.isRequired,
};

export default CongratsBadgeScreen;
