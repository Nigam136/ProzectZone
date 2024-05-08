import "./PaymentList.css";
import { ToastContainer } from "react-toastify";
import { Bars } from "react-loading-icons";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { getAllPayments } from "../../axios/instance";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPayments = async () => {
    setIsLoading(true);
    try {
      const response = await getAllPayments();
    //   console.log("nbirbfd",response.data);

      setPayments(response.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPayments();
  }, []);

  if (isLoading) {
    return (
      <div className="loading_indicator">
        <Bars stroke={"#6f6ee1"} fill="#6f6ee1" width="60" height="90" />
        <p> Fetching Payments List </p>
      </div>
    );
  }
  return (
    <div className="table_div">
      <Helmet title="Project Zone | Find Projects" />
      <ToastContainer position="top-right" />
      <div className="table_div_heading">Payments Created</div>

      <table className="table table-hover">
        <thead id="table_head">
          <tr>
            <th scope="col">No.</th>
            <th scope="col">User Name</th>
            <th scope="col">project Name</th>
            <th scope="col">Payment Method</th>
            <th scope="col">Payment ID</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody id="table_body">
          {payments.map((payment, index) => (
            <tr key={payment._id}>
              <td scope="row">{index + 1}</td>
              <td>{payment.userName}</td>
              <td>{payment.projectName}</td>
              <td>{payment.payment_method}</td>
              <td>{payment.payment_Id}</td>
              <td>{payment.amount} Rs.</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentList;
