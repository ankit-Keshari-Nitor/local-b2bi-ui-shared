import React from "react";
//import Login from "./components/Login/Login"; //without carbon dependency
import Login1 from "./components/Login1/Login1"; //with carbon dependency

export default function App(props) {
  return (
    <div>
    {/* <Login /> */}
      <Login1 />
    </div>
  );
};
