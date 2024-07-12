import React from "react";
import Login from "./components/Login/Login";

export default function App(props) {
  return (
    <div className="main-container">
      <Login props={props}/>
    </div>
  );
};
