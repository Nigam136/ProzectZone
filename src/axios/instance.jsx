import axios from "axios";

const url = "http://localhost:8000";

export const server = axios.create({
  baseURL: url,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

//AUTH
export const login = (data) => server.post(`${url}/signin`, data);
export const signup = (data) => server.post(`${url}/signup`, data);
export const forgetpassword = (data) =>
  server.post(`${url}/send-forgetpassword-email`, data);
export const SetNewPassword = (data) =>
  server.post(`${url}/reset-password`, data);

//PROFILE
export const profile = () => server.get(`${url}/profile`);
export const GetUserProfile = (data) => server.post(`${url}/user-by-id`, data);
export const UpdateUserData = (data) =>
  server.patch(`${url}/update-user-dashboard`, data);

export const sendverifyemail = () => server.get(`${url}/send-verify-email`);
export const verifyemail = (data) => server.post(`${url}/verify-email`, data);

//PROJECT
export const addproject = (data) => server.post(`${url}/addproject`, data);
export const addContributor = (data) => server.post(`${url}/addcontributor`, data);
export const getAllContributors = () => server.get(`${url}/getallcontributors`);
export const verifyContributor = (data) => server.patch(`${url}/verifycontributor`, data);
export const RejectContributor = (data) => server.patch(`${url}/declinerequest`, data);
export const sendmessage = (data) =>
  server.post(`${url}/send-contact-email`, data);
export const GetSingleProject = (data) =>
  server.post(`${url}/project-by-id`, data);

export const AddLike = (data) => server.patch(`${url}/add-like`, data);
export const AddBadge = (data) => server.patch(`${url}/add-badge`, data);
export const AddComment = (data) => server.patch(`${url}/add-comment`, data);
export const AddNewRating = (data) =>
  server.patch(`${url}/add-new-rating`, data);
export const UpvoteComment = (data) =>
  server.patch(`${url}/upvote-comment`, data);
export const AddFollower = (data) => server.patch(`${url}/addfollower`, data);

//PAYMENT
export const Payment = (data) => server.post(`${url}/subscription-payment`, data);
export const createPayment = (data) => server.post(`${url}/create-payment`, data);
export const getPaymentByID = (data) => server.post(`${url}/get-single-payment-by-id`, data);
export const getPaymentByUserID = (data) => server.post(`${url}/get-single-payment-by-userId`, data);
export const getPaymentByProjectID = (data) => server.post(`${url}/get-single-payment-by-projectId`, data);
export const getAllPayments = () => server.get(`${url}/getAllPayments`);


