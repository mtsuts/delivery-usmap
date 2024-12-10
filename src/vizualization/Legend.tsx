import React from "react";

const LegendBar = ({ startColor = "#33E48E", endColor = "#004223", height = "20px" }) => {
  const gradientStyle = {
    background: `linear-gradient(90deg, ${startColor} 0%, ${endColor} 100%)`,
    height: height,
    borderRadius: "10px",
    width: '170px',
  };

  return <div style={gradientStyle}></div>;
};

export default LegendBar;
