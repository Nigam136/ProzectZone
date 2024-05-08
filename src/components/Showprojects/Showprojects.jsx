import "./Showprojects.css";
import styled from "styled-components";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import { useDataLayerValues } from "../../datalayer";
import { server } from "../../axios/instance";
import { ToastContainer, toast } from "react-toastify";
import { Pagination } from "@material-ui/lab";
import { Link } from "react-router-dom";
import Project from "../Project/Project";
import { Bars } from "react-loading-icons";
import { getSkillColor } from "../../utils";
import { Helmet } from "react-helmet";
import SearchBox from "../SearchBox/SearchBox";
import { useMediaQuery } from "@material-ui/core";


const Option = styled.button`
  color: ${(props) => (props.optionColor ? props.optionColor : "#FFF")};
  min-width: ${(props) =>
    props.option ? `${props.option.split(" ").length * 90}px` : "100px"};
  font-family: "Poppins";
  background-color: #fff;
  border: 2px solid #000;
  border-color: ${(props) => (props.optionColor ? props.optionColor : "#FFF")};
  border-radius: 20px;
  margin: 0 10px;
  padding: 5px 10px;
  white-space: nowrap;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.3s ease-out;
  &:hover {
    color: #fff;
    background-color: ${(props) =>
      props.optionColor ? props.optionColor : "#FFF"};
    transform: scale(0.95);
  }
`;

const useStyles = makeStyles((theme) => ({
  paginator: {
    justifyContent: "center",
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(3),
  },
}));

const Showprojects = () => {
  const muitheme = useTheme();
  const isMobile = useMediaQuery(muitheme.breakpoints.down("sm"));
  const itemsPerPage = isMobile ? 6 : 12;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setfilter] = useState({
    Beginner: true,
    Intermediate: true,
    Advanced: true,
    added: false,
  });
  const [projects, setProjects] = useState([]);
  const [filteredprojects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [{ user, dashboard, query, isAuthenticated }, dispatch] =
    useDataLayerValues();

    console.log("isAuthenticated", user.data);

  const classes = useStyles();
  const [dataCheck, setDatacheck] = useState("init");

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scroll(0, 420);
  };

  const defaultOptionsRow1 = [
    "JavaScript",
    "Python",
    "HTML",
    "CSS",
    "React",
    "Java",
    "Express",
    "C++",
    "NextJS",
    "C",
  ];

  const defaultOptionsRow2 = [
    "FullStack",
    "MongoDB",
    "NodeJs",
    "flutter",
    "android",
    "MERN",
    "Backend",
    "Frontend",
    "OpenCV",
    "Artificial Intillegence",
  ];

  const defaultOptionsRow3 = [
    "Machine Learning",
    "AR",
    "VR",
    "django",
    "php",
    "Kotlin",
    "Blockchain",
    "arduino",
    "iot",
  ];

  const [randomProject, setRandomProject] = useState("");

  const fetchProjects = async (queryoption = "", querytype = "Skill") => {
    if(!isAuthenticated){
      toast.error("Please login First!");
      return;
    }
    setIsLoading(true);
    // console.log("queryoption", queryoption);
    // console.log("querytype", querytype);
    const type = querytype.toLowerCase();

    try {
      setRandomProject("");

      if (queryoption !== "") {
        const results = await server.get(
          `/getprojectsby${type}?q=${queryoption}`
        );
        if (results.status === 200) {
          setProjects(results.data);
          setFilteredProjects(results.data);
          setDatacheck("some data");
        } else {
          setDatacheck("no data");
        }

        setTotalPages(Math.ceil(results.data.length / itemsPerPage));
        setIsLoading(false);
      } else if (query !== "") {
        const results = await server.get(`/getprojectsby${type}?q=${query}`);
        setProjects(results.data);
        setFilteredProjects(results.data);
        if (results?.data?.length > 0) {
          setDatacheck("some data");
        } else {
          setDatacheck("no data");
        }
        setTotalPages(Math.ceil(results.data.length / itemsPerPage));
        setIsLoading(false);
      } else {
        toast.error("Please enter or select a query first");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const setDefaultQuery = (e) => {
    e.preventDefault();
    // console.log("search", e.target.innerText);
    dispatch({
      type: "SET_QUERY",
      query: e.target.innerText,
    });
    // setFilteredProjects([])
    // setProjects([])
    // setDatacheck("no data");
    fetchProjects(e.target.innerText);
  };

  const handleRandomProject = () => {
    setRandomProject(
      filteredprojects[Math.floor(Math.random() * filteredprojects.length)]
    );
  };

  const checkboxHandler = (e) => {
    const name = e.target.name;

    switch (name) {
      case "Beginner":
        setfilter({ ...filter, Beginner: !filter.Beginner });
        break;
      case "Intermediate":
        setfilter({ ...filter, Intermediate: !filter.Intermediate });
        break;
      case "Advanced":
        setfilter({ ...filter, Advanced: !filter.Advanced });
        break;
      case "added":
        setfilter({ ...filter, added: !filter.added });
        break;
      default:
        return;
    }
  };

  const filterByCheck = (project) => {
    if (filter[`${project.level}`]) return project;
    else if (
      filter["added"] &&
      dashboard.projects_added.indexOf(project.name) !== -1
    )
      return project;
  };

  // useEffect(()=>{
  //   if(isAuthenticated)
  // },[isAuthenticated])

  useEffect(() => {
    // console.log(projects);
    let filtered = projects?.filter((project) => filterByCheck(project));
    setFilteredProjects(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setPage(1);

    // console.log(filteredprojects);
    // console.log(projects);
    // console.log(dataCheck);
  }, [projects, filter]);

  return (
    <div className="showProjects">
      <Helmet title="Project Zone | Find Projects" />
      <ToastContainer />
      <div className="mt">
        <SearchBox fetchProjects={fetchProjects} />

        <div className="default_options filtre-div">
          <label className="container">
            Beginner Level
            <input
              defaultChecked={true}
              name="Beginner"
              type="checkbox"
              onChange={checkboxHandler}
            />
            <span className="checkmark"></span>
          </label>
          <label className="container">
            Intermediate Level
            <input
              defaultChecked={true}
              name="Intermediate"
              type="checkbox"
              onChange={checkboxHandler}
            />
            <span className="checkmark"></span>
          </label>
          <label className="container">
            Advanced Level
            <input
              defaultChecked={true}
              name="Advanced"
              type="checkbox"
              onChange={checkboxHandler}
            />
            <span className="checkmark"></span>
          </label>
          <label className="container">
            Added Projects
            <input
              defaultChecked={false}
              name="added"
              type="checkbox"
              onChange={checkboxHandler}
            />
            <span className="checkmark"></span>
          </label>
        </div>
        <div className="default_options">
          {defaultOptionsRow1.map((option, index) => {
            return (
              <Option
                type="submit"
                onClick={setDefaultQuery}
                value={query}
                key={index}
                option={option}
                optionColor={getSkillColor(option)}
              >
                {option}
              </Option>
            );
          })}
        </div>
        <div className="default_options">
          {defaultOptionsRow2.map((option, index) => {
            return (
              <Option
                type="submit"
                onClick={(e) => setDefaultQuery(e)}
                value={query}
                key={index}
                option={option}
                optionColor={getSkillColor(option)}
              >
                {option}
              </Option>
            );
          })}
        </div>
        <div className="default_options">
          {defaultOptionsRow3.map((option, index) => {
            return (
              <Option
                type="submit"
                onClick={(e) => setDefaultQuery(e)}
                value={query}
                key={index}
                option={option}
                optionColor={getSkillColor(option)}
              >
                {option}
              </Option>
            );
          })}
        </div>
      </div>

      <div className="random_btn-box">
        {query && filteredprojects ? (
          <Option
            onClick={handleRandomProject}
            optionColor={"#6f6ee1"}
            option={"Let decide project"}
          >
            Let us decide a project for you.
          </Option>
        ) : null}
      </div>

      {randomProject ? (
        <div className="randomProject">
          <Project
            title={randomProject.name}
            desc={randomProject.description}
            skills={randomProject.skills}
            level={randomProject.level}
            likes={randomProject.likes}
            rating={randomProject.rating}
            comments={randomProject.comments}
            id={randomProject._id}
            style={{ backgroundColor: "#6f6ee1", color: "#FFF" }}
          />
        </div>
      ) : null}

      {query ? (
        <h2 className="query"> Searching projects for `{query}` </h2>
      ) : (
        <h2 className="query"> Enter query to search for projects. </h2>
      )}

      {isLoading ? (
        <div className="loading_indicator">
          <Bars stroke={"#6f6ee1"} fill="#6f6ee1" width="60" height="90" />
          <p> Fetching {query} projects </p>
        </div>
      ) : null}

      <div className="projectsList">
        {filteredprojects && dataCheck === "some data" ? (
          filteredprojects
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((project, ind) => {
              return (
                <Project
                  key={ind}
                  id={project._id}
                  title={project.name}
                  desc={project.description}
                  skills={project.skills}
                  level={project.level}
                  likes={project.likes}
                  rating={project.rating}
                  comments={project.comments}
                />
              );
            })
        ) : dataCheck === "no data" ? (
          <div style={{ textAlign: "center" }}>
            <h3>Oopps !! No projects found.</h3>
            {user?.data?.isContributor ===true  ? (
              <Link to="/addnew">Add new project</Link>
            ) : (
              <div className="mt-5">
                <h3>You are not Contributor to the ProjectZone</h3>
                <h5>To Become Contributor Fill Out This Form.</h5>
                <Link to="/contributors-form" className="text-decoration-none btn">Make Contribution</Link>
              </div>
            )}
          </div> 
        ) : null}
      </div>
      {filteredprojects && filteredprojects.length > 0 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          defaultPage={1}
          color="primary"
          size={isMobile ? "small" : "large"}
          showFirstButton={!isMobile}
          showLastButton={!isMobile}
          classes={{ ul: classes.paginator }}
        />
      )}
    </div>
  );
};

export default Showprojects;
