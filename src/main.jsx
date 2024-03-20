import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "antd/dist/antd.js";
import "react-toastify/dist/ReactToastify.css"
import { DataLayer } from "./datalayer";
import reducer, { initialState } from "./reducer";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DataLayer initialState={initialState} reducer={reducer}>
      <App />
    </DataLayer>
  </React.StrictMode>
);
