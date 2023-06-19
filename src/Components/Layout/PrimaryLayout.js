import React from "react";
import Container from "react-bootstrap/Container";

import Header from "../Header/Header";
import "./PrimaryLayout.scss";

const PrimaryLayout = ({ children }) => {
  return (
    <div className="primary-layout">
      <Header />
      <Container>{children}</Container>
    </div>
  );
};

export default PrimaryLayout;
