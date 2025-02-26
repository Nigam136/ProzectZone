import { useEffect, useState } from "react";
import { useDataLayerValues } from "../../datalayer";
import profileavatar from "../../assets/user.png";
import "./Profile.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePalette } from "react-palette";
import {
  AddFollower,
  GetUserProfile,
  UpdateUserData,
  sendverifyemail,
} from "../../axios/instance";
import { ToastContainer, toast } from "react-toastify";
import { Helmet } from "react-helmet";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { Oval, Puff } from "react-loading-icons";
// import { getSkillColor } from "../../utils";
import { GitHub } from "@material-ui/icons";
import { LinkedIn } from "@material-ui/icons";
import { Facebook } from "@material-ui/icons";
import { Edit } from "@material-ui/icons";
import closeButton from "../../assets/close.svg";
import certificate from "./../../assets/certi.svg";
import heart from "./../../assets/heart.svg";
import star from "./../../assets/star1.svg";
import { BlurCircular as AddCircle } from "@material-ui/icons";

const Profile = () => {
  const [{ dashboard, user, isemailverified, isAuthenticated }, dispatch] =
    useDataLayerValues();
  const [editmodalVisibility, setEditModalVisibility] = useState("false");
  const [followmodalVisibility, setFollowModalVisibility] = useState("false");
  const [isLoading, setIsLoading] = useState(true);
  const [follow, setFollow] = useState(true);
  const { data } = usePalette(dashboard.profile_pic);
  const navigate = useNavigate();
  const { profileid } = useParams();

  console.log("dashboard", dashboard);
  // console.log("user", dashboard.badge.badge_description);

  const fetchProfile = async (id) => {
    setIsLoading(true);

    const body = {
      id: id,
    };

    try {
      const profileuser = await GetUserProfile(body);

      const dashboard_data = {
        ...dashboard,
        id: profileuser.data._id,
        fname: profileuser.data.firstname,
        lname: profileuser.data.lastname,
        email: profileuser.data.email,
        bio: profileuser.data.profile.bio,
        description: profileuser.data.profile.description,
        profile_pic:
          profileuser?.data?.profile?.profile_pic &&
          profileuser.data.profile.profile_pic,
        projectones: profileuser.data.profile.projectones,
        projects_added: profileuser.data.profile.projects_added,
        projects_liked: profileuser.data.profile.projects_liked,
        projects_rated: profileuser.data.profile.projects_rated,
        followers: profileuser.data.profile.followers,
        following: profileuser.data.profile.following,
        badges: profileuser.data.profile.badges,
        social_links: profileuser.data.profile.social_links,
        created_at: profileuser.data.created_at,
      };

      dispatch({
        type: "SET_USER_DASHBOARD_DATA",
        dashboard: dashboard_data,
      });

      let found = profileuser.data.profile.followers.find((obj) => {
        return obj.person_id === user.userid;
      });
      setFollow(found);

      if (profileid === user.userid) {
        setFields({
          fname: profileuser.data.firstname,
          lname: profileuser.data.lastname,
          profileimg:
            profileuser?.data?.profile?.profile_pic &&
            profileuser.data.profile.profile_pic,
          githublink: profileuser.data.profile.social_links.github,
          linkedinlink: profileuser.data.profile.social_links.linkdin,
          fblink: profileuser.data.profile.social_links.facebook,
          bio: profileuser.data.profile.bio,
          descr: profileuser.data.profile.description,
        });
      }
    } catch (err) {
      if (err.response) {
        toast.error(`${err.response.data.error}`);
        navigate("/user-not-found");
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    // window.scroll(0, 0);
    console.log("profile ID called");
    fetchProfile(profileid);
  }, [profileid]);

  const [fields, setFields] = useState({
    fname: "",
    lname: "",
    profileimg: "",
    githublink: "",
    linkedinlink: "",
    fblink: "",
    bio: "",
    descr: "",
  });
  const { fname, lname, githublink, linkedinlink, fblink, bio, descr } = fields;

  const [followdata, setFollowData] = useState({
    title: "",
    people: [],
  });

  const toggleEditModalVisibility = () => {
    setEditModalVisibility(!editmodalVisibility);
  };

  const toggleFollowModalVisibility = () => {
    setFollowModalVisibility(!followmodalVisibility);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const setFollowersToModal = () => {
    setFollowData({
      title: "Followers",
      people: dashboard.followers,
    });
    toggleFollowModalVisibility();
  };

  const setFollowingToModal = () => {
    setFollowData({
      title: "Following",
      people: dashboard.following,
    });
    toggleFollowModalVisibility();
  };

  const handlechnageInput = async (e) => {
    const basse64 = await convertBase64(e.target.files[0]);
    setFields((prevState) => {
      return {
        ...prevState,
        profileimg: basse64,
      };
    });
  };

  const handleSubmit = (e) => {
    setIsLoading(true);

    e.preventDefault();
    if (bio === "") {
      toast.error("Please enter your bio   ");
      setIsLoading(false);
    } else if (descr === "") {
      toast.error("Please enter description");
      setIsLoading(false);
    } else if (fname === "") {
      toast.error("Please enter valid firstname");
      setIsLoading(false);
    } else if (lname === "") {
      toast.error("Please enter valid lastname");
      setIsLoading(false);
    } else {
      const data = {
        firstname: fields.fname,
        lastname: fields.lname,
        email: user.email,
        profile: {
          bio: fields.bio,
          description: fields.descr,
          profile_pic: fields.profileimg,
          projectones: dashboard.projectones,
          projects_added: dashboard.projects_added,
          badges: dashboard.badges,
          social_links: {
            github: fields.githublink,
            linkdin: fields.linkedinlink,
            facebook: fields.fblink,
          },
        },
        created_at: dashboard.created_at,
      };

      updatedata(data);
      toast.success("Profile updated");
      setIsLoading(false);
    }
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const updatedata = async (data) => {
    const userdata = {
      ...user,
      fname: data.firstname,
      lname: data.lastname,
    };
    const dashboard_data = {
      ...dashboard,
      bio: data.profile.bio,
      description: data.profile.description,
      profile_pic: data.profile.profile_pic,
      social_links: data.profile.social_links,
    };

    const maindata = {
      data: data,
    };

    try {
      await UpdateUserData(maindata);

      dispatch({
        type: "SET_USER",
        user: userdata,
      });
      dispatch({
        type: "SET_USER_DASHBOARD_DATA",
        dashboard: dashboard_data,
      });

      toggleEditModalVisibility();
    } catch (err) {
      if (err.response) {
        toast.error(`${err.response.data.error}`);
        setIsLoading(false);
      }
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated) {
      return toast.error(`You have to login first`);
    }

    const data = {
      following_id: profileid,
      following_name: dashboard.fname,
      follower_name: user.fname,
    };

    try {
      const res = await AddFollower(data);
      const followers_new = res.data.data;

      const dashboard_data = {
        ...dashboard,
        followers: followers_new,
      };

      dispatch({
        type: "SET_USER_DASHBOARD_DATA",
        dashboard: dashboard_data,
      });

      toast.success(`${res.data.msg}`);
    } catch (err) {
      if (err.response) {
        toast.error(`${err.response.data.error}`);
      }
    }
  };

  const emailVerifyBtn = async () => {
    try {
      const res = await sendverifyemail();
      if (res.status === 200) {
        window.alert(res.data.msg);
        toast.success(res.data.msg);
      }
    } catch (err) {
      if (err.response) {
        toast.error(`${err.response.data.error}`);
      }
    }
  };

  return (
    <>
      <Helmet
        title={`Project Zone | ${
          dashboard.fname ? dashboard.fname : "Profile"
        }`}
      />
      <ToastContainer position="bottom-center" />
      {isLoading ? (
        <div className="loading_indicator profile_loading">
          <Oval stroke={"#6f6ee1"} className="profile_oval" />
          <p> Fetching Profile Details </p>
        </div>
      ) : (
        <>
          <div className="profile_wrapper">
            <div className="person_card">
              <div
                className="card_top"
                style={{ backgroundColor: data?.vibrant }}
              >
                {dashboard.profile_pic === "" ? (
                  <img src={profileavatar} alt="user_profile_img" />
                ) : (
                  <img src={dashboard.profile_pic} alt="user_profile_img" />
                )}
              </div>
              <div className="card_content">
                <div className="card_name">
                  {dashboard.fname + " " + dashboard.lname}
                </div>
                <div className="card_bio">
                  {dashboard.bio === "" ? <i>No bio set</i> : dashboard.bio}
                </div>
                <div className="social_icons">
                  {dashboard.social_links ? (
                    <>
                      {" "}
                      {!dashboard.social_links.github == "" ? (
                        <a
                          href={dashboard.social_links.github}
                          target="_blank"
                          className="githublink"
                        >
                          <GitHub />
                        </a>
                      ) : null}
                      {!dashboard.social_links.linkdin == "" ? (
                        <a
                          href={dashboard.social_links.linkdin}
                          target="_blank"
                          className="linkedinlink"
                        >
                          <LinkedIn />
                        </a>
                      ) : null}
                      {!dashboard.social_links.facebook == "" ? (
                        <a
                          href={dashboard.social_links.facebook}
                          target="_blank"
                          className="facebooklink"
                        >
                          <Facebook />
                        </a>
                      ) : null}
                    </>
                  ) : null}
                </div>
                <div className="projectones">
                  <div className="tones_name">Projectones:-&nbsp;</div>{" "}
                  <div>{dashboard.projectones}</div>
                </div>
                {dashboard.id === user.userid ? (
                  <>
                    <button
                      className="editbtn"
                      onClick={toggleEditModalVisibility}
                    >
                      Edit Profile
                    </button>
                    <Link to="/addnew" className="addnewlink">
                      <button className="addnewbtn">Add New Project</button>
                    </Link>
                    {isemailverified ? (
                      <div className="email_verified_msg">
                        <strong>Email Verified </strong> <CheckCircleIcon />
                      </div>
                    ) : (
                      <button className="editbtn" onClick={emailVerifyBtn}>
                        Verify Email
                      </button>
                    )}
                  </>
                ) : null}
              </div>
            </div>
            <div className="content_right">
              <div className="email_descr">
                <div className="emaildesc_left">
                  <div className="mail">
                    <h2>Email: </h2>
                    <div> {dashboard.email}</div>{" "}
                  </div>
                  <div className="desc">
                    {dashboard.description === "" ? (
                      <i>No Description Added</i>
                    ) : (
                      <>
                        <div className="desc_head">Description: </div>
                        <div>{dashboard.description}</div>
                      </>
                    )}
                  </div>
                </div>
                <div className="follow_right">
                  {dashboard.id !== user.userid ? (
                    <div className="followuser">
                      {follow ? (
                        <button
                          className="followuserbtn"
                          onClick={handleFollow}
                        >
                          Follow
                        </button>
                      ) : (
                        <button className="followuserbtn">Following</button>
                      )}
                    </div>
                  ) : null}
                  <div className="followersing">
                    <button
                      className="followbtns"
                      onClick={setFollowersToModal}
                    >{`Followers : ${dashboard.followers.length}`}</button>
                    <button
                      className="followbtns"
                      onClick={setFollowingToModal}
                    >{`Following : ${dashboard.following.length}`}</button>
                  </div>
                </div>
              </div>
              <div className="projects_badges">
                <h2>Projects Added</h2>
                {dashboard.projects_added.length > 0 ? (
                  <ul className="projects_list">
                    {dashboard.projects_added.map((project, i) => {
                      return (
                        <div className="list_card" key={i}>
                          <li className="list_li">
                            <Link
                              to={`/projectdetails/${project.project_id}`}
                              className="link"
                            >
                              <AddCircle />
                              <div className="proj_name">{project.name}</div>
                            </Link>
                            <div className="user_name">
                              <div className="added">Added By:-&nbsp; </div>
                              {dashboard.fname} {dashboard.lname}
                            </div>
                          </li>
                        </div>
                      );
                    })}
                  </ul>
                ) : (
                  <i>No Projects added </i>
                )}
                <div className="badge_head">
                  <h2>Badges</h2>
                </div>
                {dashboard.badges && dashboard.badges.length > 0 ? (
                  <div className="badges_list">
                    {dashboard.badges.map((badge, i) => {
                      return (
                        <div className="badge_container" key={i}>
                          {badge.badge_description
                            .split(" ")
                            .slice(0, 1)
                            .includes("Liked") ? (
                            <img className="heart" src={heart} alt="heart" />
                          ) : badge.badge_description
                              .split(" ")
                              .slice(0, 1)
                              .includes("Rated") ? (
                            <img className="star" src={star} alt="star" />
                          ) : (
                            <img
                              className="certificate"
                              src={certificate}
                              alt="certifiacte"
                            />
                          )}

                          <div className="badge_title">{badge.title}</div>
                          <p className="badge_dsc">{badge.badge_description}</p>
                          <span className="badge_date">
                            Earned on{" "}
                            {badge.earnedat.split(" ").slice(0, 2).join(" ")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <i>No Badges Won </i>
                )}
              </div>
            </div>
            {dashboard.id === user.userid ? (
              <>
                <div
                  className={`overlay ${
                    editmodalVisibility && "overlay_hidden"
                  }`}
                  onClick={toggleEditModalVisibility}
                ></div>
                <form
                  className={`editmodal ${
                    editmodalVisibility && "editmodal_hidden"
                  }`}
                  onSubmit={handleSubmit}
                >
                  <div className="editmodal_left ">
                    <div className="img_container">
                      {fields.profileimg === "" ? (
                        <img src={profileavatar} alt="user_profile_img" />
                      ) : (
                        <img src={fields.profileimg} alt="user_profile_img" />
                      )}
                      <div className="img_overlay">
                        <div className="fa-edit">
                          <Edit />
                          <input
                            name="profileimg"
                            className="image-upload"
                            type="file"
                            onChange={handlechnageInput}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="social_info ">
                      <div className="social_icon">
                        <GitHub />
                      </div>
                      <input
                        className="social_input"
                        name="githublink"
                        value={githublink}
                        onChange={handleChange}
                        placeholder="github link"
                      ></input>
                    </div>
                    <div className="social_info">
                      <div className="social_icon">
                        <LinkedIn />
                      </div>
                      <input
                        className="social_input"
                        name="linkedinlink"
                        value={linkedinlink}
                        onChange={handleChange}
                        placeholder="linkdin link"
                      ></input>
                    </div>
                    <div className="social_info">
                      <div className="social_icon">
                        {" "}
                        <Facebook />
                      </div>
                      <input
                        className="social_input"
                        name="fblink"
                        value={fblink}
                        onChange={handleChange}
                        placeholder="facebook link"
                      ></input>
                    </div>

                    <div className="btn_loader">
                      <button type="submit" className="left_submit">
                        Submit
                      </button>

                      {isLoading ? (
                        <Puff
                          stroke="#6f6ee1"
                          fill="#6f6ee1"
                          width="30"
                          height="90"
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="editmodal_right">
                    <div className="forminput">
                      <label htmlFor="email">
                        Firstname<span>*</span>
                      </label>
                      <input
                        type="text"
                        id="fname"
                        placeholder="Enter your firstname"
                        name="fname"
                        value={fname}
                        className="edit_input"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="forminput">
                      <label htmlFor="email">
                        Lastname<span>*</span>
                      </label>
                      <input
                        type="lname"
                        id="lname"
                        placeholder="Enter your Lastname"
                        name="lname"
                        value={lname}
                        className="edit_input"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="forminput">
                      <label htmlFor="email">
                        Bio<span>*</span>
                      </label>
                      <input
                        type="text"
                        id="profession"
                        placeholder="Enter your Bio"
                        name="bio"
                        value={bio}
                        className="edit_input"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="forminput">
                      <label htmlFor="email">
                        Description<span>*</span>
                      </label>
                      <textarea
                        id="descr"
                        placeholder="Tell us something about yourself"
                        name="descr"
                        value={descr}
                        rows="6"
                        className="edit_input"
                        onChange={handleChange}
                      />
                    </div>

                    <button type="submit" className="right_submit">
                      Submit
                    </button>
                  </div>
                  <div
                    className="editmodal_closebar"
                    onClick={toggleEditModalVisibility}
                  >
                    <img
                      src={closeButton}
                      alt="close"
                      className="editmodal_close_img"
                    />
                  </div>
                </form>
              </>
            ) : null}

            <div
              className={`overlay ${followmodalVisibility && "overlay_hidden"}`}
              onClick={toggleFollowModalVisibility}
            ></div>
            <div
              className={`followmodal ${
                followmodalVisibility && "followmodal_hidden"
              }`}
            >
              <h3 className="follow_title">{followdata.title}</h3>
              <hr />
              {followdata.people && followdata.people.length > 0 ? (
                <ul className="projects_list">
                  {followdata.people.map((person, i) => {
                    return (
                      <li key={i}>
                        <Link
                          to={`/profile/${person._id}`}
                          onClick={toggleFollowModalVisibility}
                          className="link"
                        >
                          <AddCircle />
                          <div className="proj_name"> {person.fname}</div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <i>{`No ${followdata.title}`}</i>
              )}
              <div
                className="editmodal_closebar"
                onClick={toggleFollowModalVisibility}
              >
                <img
                  src={closeButton}
                  alt="close"
                  className="editmodal_close_img"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
