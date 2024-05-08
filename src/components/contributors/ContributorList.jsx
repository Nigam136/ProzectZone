import { useEffect, useState } from "react";
import "./ContributorList.css";
import {
  RejectContributor,
  getAllContributors,
  verifyContributor,
} from "../../axios/instance";
import { ToastContainer, toast } from "react-toastify";
// import { useDataLayerValues } from "../../datalayer";
import { Bars } from "react-loading-icons";
import { Helmet } from "react-helmet";

const ContributorList = () => {
  const [contributors, setContributors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getContributors = async () => {
    setIsLoading(true);
    try {
      const response = await getAllContributors();
      // console.log(response.data);

      setContributors(response.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const acceptRequest = async (requestId) => {
    setIsLoading(true);
    const data = {
      requestId: requestId,
    };
    try {
      const response = await verifyContributor(data);
      console.log(response.data);

      getContributors();
      setTimeout(() => {
        toast.success(response.data.message);
      }, 500);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      toast.error(err.data.error.message);
      setIsLoading(false);
    }
  };

  const rejectRequest = async (requestId) => {
    setIsLoading(true);
    const data = {
      requestId: requestId,
    };
    try {
      const response = await RejectContributor(data);
      console.log(response.data);

      getContributors();
      setTimeout(() => {
        toast.success(response.data.message);
      }, 500);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      toast.error(err.data.error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getContributors();
  }, []);

  if (isLoading) {
    return (
      <div className="loading_indicator">
        <Bars stroke={"#6f6ee1"} fill="#6f6ee1" width="60" height="90" />
        <p> Fetching Requests </p>
      </div>
    );
  }

  return (
    <div className="table_div">
      <Helmet title="Project Zone | Find Projects" />
      <ToastContainer position="top-right" />
      <div className="table_div_heading">Contribution Requests</div>
      <table className="table table-hover">
        <thead id="table_head">
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Request Message</th>
            <th scope="col">Experience Level</th>
            <th scope="col">Projects</th>
            <th scope="col">Project Details</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody id="table_body">
          {contributors.map((contributor, index) => (
            <tr key={contributor._id}>
              <td scope="row">{index + 1}</td>
              <td>{contributor.name}</td>
              <td>{contributor.email}</td>
              <td>{contributor.requestMessage}</td>
              <td>{contributor.experienceLevel}</td>
              <td>{contributor.numberOfProjects}</td>
              <td>{contributor.projectDetails}</td>
              <td className="">
                {!contributor.isAccepted ? (
                  <>
                    <button
                      type="submit"
                      className="acceptbtn"
                      onClick={() => acceptRequest(contributor._id)}
                    >
                      Accept
                    </button>
                    <button
                      type="submit"
                      className="rejectbtn"
                      onClick={() => rejectRequest(contributor._id)}
                    >
                      Reject
                    </button>
                  </>
                ) : contributor.isContributor ? (
                  <td>Accepted</td>
                ) : (
                  <td>Rejected</td>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContributorList;
