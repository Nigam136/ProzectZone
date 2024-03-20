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


//PROJECT
export const sendmessage = (data) => server.post(`${url}/send-contact-email`, data);
export const GetSingleProject = (data) => server.post(`${url}/project-by-id`, data);

export const AddLike = (data) => server.patch(`${url}/add-like`, data);
export const AddBadge = (data) => server.patch(`${url}/add-badge`, data);
