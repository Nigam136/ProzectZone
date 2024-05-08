import PropTypes from "prop-types";
import logo from "../Footer/icon.png";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useDataLayerValues } from "../../datalayer";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import "../../App.css";
import "./Navbar.css";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={3}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "& .MuiListItemIcon-root": {
      minWidth: "30px",
    },
    "& .MuiButton-root": {
      color: "#FFF !important",
    },
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: "#5352ed",
    },
    "&:focus": {
      backgroundColor: "#6c6be8",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
    "&:hover": {
      backgroundColor: "#6c6be8",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const Navbar = ({ themeToggler }) => {
  const classes = useStyles();
  // console.log(classes);
  const [{ isAuthenticated, user }, dispatch] = useDataLayerValues();
  const [anchorEl, setAnchorEl] = useState(null);
  console.log("qwertyu", user.data);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const muitheme = useTheme();
  const isMobile = useMediaQuery(muitheme.breakpoints.down("sm"));

  const logoutHandler = async () => {
    localStorage.removeItem("tokken");
    const userData = {
      ...user,
      fname: "",
      lname: "",
      email: "",
      password: "password",
    };
    dispatch({
      type: "SET_AUTH",
      isAuthenticated: false,
    });
    dispatch({
      type: "SET_USER",
      user: userData,
    });
    navigate("/");
  };

  // console.log(themeToggler);

  return (
    <div>
      <AppBar
        position="fixed"
        style={{ backgroundColor: "#6f6ee1", boxShadow: "none" }}
      >
        <Toolbar className="NavWithToggleSwitch">
          <div className="NavHeading">
            <Typography variant="">
              <Link to="/" className="name">
                <div className="NavHeading-div">
                  <img src={logo} alt="logo" className="logo" />
                  <div className="title-project">Project Zone</div>
                </div>
              </Link>
            </Typography>
          </div>
          <div className="links">
            {isMobile ? (
              <>
                <Button onClick={handleClick}>
                  <MenuIcon />
                </Button>
                <StyledMenu
                  id="customized-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <Link to="/" onClick={handleClose}>
                    <StyledMenuItem>
                      <ListItemIcon>
                        <i className="fa fa-home"></i>
                      </ListItemIcon>
                      <ListItemText primary="Home"></ListItemText>
                    </StyledMenuItem>
                  </Link>
                  {isAuthenticated ? (
                    <Link to={`/profile/${user.userid}`} onClick={handleClose}>
                      <StyledMenuItem>
                        <ListItemIcon>
                          <i className="fa fa-user-circle-o"></i>
                        </ListItemIcon>
                        <ListItemText
                          primary={`Welcome ${user.fname}`}
                        ></ListItemText>
                      </StyledMenuItem>
                    </Link>
                  ) : null}
                  <Link to="/projects" onClick={handleClose}>
                    <StyledMenuItem>
                      <ListItemIcon>
                        <i className="fa fa-file"></i>
                      </ListItemIcon>
                      <ListItemText primary="Find Projects"></ListItemText>
                    </StyledMenuItem>
                  </Link>
                  {!isAuthenticated ? (
                    <Link to="/login" onClick={handleClose}>
                      <StyledMenuItem>
                        <ListItemIcon>
                          <i className="fa fa-sign-in"></i>
                        </ListItemIcon>
                        <ListItemText primary="Login/Sign up"></ListItemText>
                      </StyledMenuItem>
                    </Link>
                  ) : null}

                  <Link to="/about" onClick={handleClose}>
                    <StyledMenuItem>
                      <ListItemIcon>
                        <i className="fa fa-users"></i>
                      </ListItemIcon>
                      <ListItemText primary="About"></ListItemText>
                    </StyledMenuItem>
                  </Link>

                  {isAuthenticated ? (
                    <Link to="/addnew" onClick={handleClose}>
                      <StyledMenuItem>
                        <ListItemIcon>
                          <i className="fa fa-plus"></i>
                        </ListItemIcon>
                        <ListItemText primary="Add New Project"></ListItemText>
                      </StyledMenuItem>
                    </Link>
                  ) : null}
                  {isAuthenticated ? (
                    <Link to="/contact" onClick={handleClose}>
                      <StyledMenuItem>
                        <ListItemIcon>
                          <i className="fa fa-id-badge"></i>
                        </ListItemIcon>
                        <ListItemText primary="Contact Us"></ListItemText>
                      </StyledMenuItem>
                    </Link>
                  ) : null}
                </StyledMenu>
              </>
            ) : (
              <>
                <div>
                  <Button className="button">
                    <Link to="/" className="text">
                      <img
                        src="/svgs/Home.svg"
                        alt="home"
                        className="fa-home"
                      />
                      <div>Home</div>
                    </Link>
                  </Button>
                </div>
                <div>
                  <Button className="button">
                    <Link to="/projects" className="text">
                      <img
                        src="/svgs/File.svg"
                        alt="file"
                        className="fa-file"
                      />
                      <div>Find Projects</div>
                    </Link>
                  </Button>
                </div>
                <div>
                  
                </div>
                <div>
                  {user.data?.role === "admin" ? <Button className="button">
                      <Link to="/payments" className="text">
                        <img
                          src="/svgs/Users.svg"
                          alt="about"
                          className="fa-about"
                        />
                        <div>Payments</div>
                      </Link>
                    </Button> : (
                    <Button className="button">
                      <Link to="/about" className="text">
                        <img
                          src="/svgs/Users.svg"
                          alt="about"
                          className="fa-about"
                        />
                        <div>About</div>
                      </Link>
                    </Button>
                  )}
                </div>
                {isAuthenticated && user.data?.role == "user" ? (
                  <div>
                    <Button className="button">
                      <Link to="/contact" className="text">
                        <img
                          src="/svgs/id-badge.svg"
                          alt="new project"
                          className="fa-id-badge"
                        />
                        <div>Contact Us</div>
                      </Link>
                    </Button>
                  </div>
                ) : isAuthenticated ? (
                  <div>
                    <Button className="button">
                      <Link to="/contributors" className="text">
                        <img
                          src="/svgs/bell.svg"
                          alt="new project"
                          className="fa-id-badge"
                        />
                        <div>Contributors</div>
                      </Link>
                    </Button>
                  </div>
                ) : null}
                {isAuthenticated && user.data?.isContributor === true ? (
                  <div>
                    <Button className="button">
                      <Link to="/addnew" className="text">
                        <img
                          src="/svgs/Plus.svg"
                          alt="new project"
                          className="fa-plus"
                        />
                        <div>Add New Project</div>
                      </Link>
                    </Button>
                  </div>
                ) : isAuthenticated && user.data?.isContributor === false ? (
                  <div>
                    <Button className="button">
                      <Link to="/contributors-form" className="text">
                        <img
                          src="/svgs/handshake.svg"
                          alt="new Contribution"
                          className="handshake"
                        />
                        <div>Make Contribution</div>
                      </Link>
                    </Button>
                  </div>
                ) : null}
                {isAuthenticated ? (
                  <Button className="button">
                    <Link
                      style={{ marginBottom: "0.4rem" }}
                      to={`/profile/${user.userid}`}
                      className="text"
                    >
                      <img
                        src="/svgs/user-circle.svg"
                        alt="user-circle"
                        className="fa-user"
                      />
                      <div>Welcome {user.fname}</div>
                    </Link>
                  </Button>
                ) : null}
                {!isAuthenticated ? (
                  <Link to="/login" className="lobut">
                    <div>Login</div>
                  </Link>
                ) : (
                  <>
                    <h4 className="lobut" onClick={logoutHandler}>
                      Logout
                    </h4>
                  </>
                )}
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};
Navbar.propTypes = {
  themeToggler: PropTypes.func.isRequired,
};

export default Navbar;
