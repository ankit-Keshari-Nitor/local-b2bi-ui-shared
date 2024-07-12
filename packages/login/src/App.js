import React from "react";
import Login1 from "./components/Login1/Login1";

export default function App(props) {
  return (
    <div className="main-container">
      <Login1 props={props}/>
    </div>
  );
};
