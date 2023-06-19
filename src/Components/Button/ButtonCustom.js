import React from "react";
import { useAccount } from "wagmi";

import "./ButtonStyle.scss";

const ButtonCustom = ({ className, title, onClick }) => {
  // const [{ data, error, loading }, disconnect] = useAccount({
  //   fetchEns: true,
  // });
  return (
    <button
      type="button"
      className={`button-style ${className}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default ButtonCustom;
