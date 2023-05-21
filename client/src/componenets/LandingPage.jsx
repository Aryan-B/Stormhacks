import { useState } from "react";
// import Spline from '@splinetool/react-spline';

import "./landingPage.css";
const LandingPage = (props) => {
  return (
    <div className={props.show ? "landingPage-show" : "landingPage-hide"}>
      <div className="half">
        <div className="head-container">
          <h1 className="heading-landing">Q-GENIUS</h1>
          <div className="heading-text">
            Boost your brainpower with 'Q-Genius': Where your words become a
            world of practice questions!
          </div>
          <button
            className="button-landing"
            onClick={() => {
              props.handleShow(false);
            }}
          >
            Get Started
          </button>
        </div>
      </div>
      <div className="half">
        <div className="spline-container">
          <div className="spline">
            <iframe
              src="https://my.spline.design/draganddropbookpencilschoolcopy-b7eb6a107dde7410357dd620f2a95838/"
              frameborder="0"
              width="100%"
              height="100%"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
