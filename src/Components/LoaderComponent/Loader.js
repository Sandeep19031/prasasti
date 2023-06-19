import { ThreeDots } from "react-loader-spinner";
import LoadingOverlay from "react-loading-overlay";
import "./LoaderStyle.scss";

import React, { useState } from "react";

const Loader = () => {
  return (
    <div className="loader-style">
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#655eec"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
    </div>
  );
};

export default Loader;
