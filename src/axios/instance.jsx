import axios from "axios";

const url =  "http://localhost:8000"


export const server = axios.create({
    baseURL: url,
    headers:{
        Accept:"application/json",
        "Content-Type":"application/json"
    }
})


//AUTH
export const login = (data) => server.post(`${url}/signin`, data);
export const signup = (data) => server.post(`${url}/signup`, data);
export const forgetpassword = (data) =>
  server.post(`${url}/send-forgetpassword-email`, data);
export const SetNewPassword = (data) =>
  server.post(`${url}/reset-password`, data);
