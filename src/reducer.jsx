export const initialState = {
  user: {
    userid: null,
    fname: "",
    lname: "",
    email: "",
    password: "",
    picture: "",
  },
};

export const actions = {
  SET_USER: "SET_USER",
  SET_AUTH: "SET_AUTH",
  LOAD_USER: "LOAD_USER",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_USER:
      return {
        ...state,
        user: action.user,
      };

    case actions.SET_AUTH:
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
      };

    default:
      return state;
  }
};

export default reducer;
