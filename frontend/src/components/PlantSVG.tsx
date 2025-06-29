import React from "react";

const PlantSVG = ({ width = 80, height = 80 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="40" cy="70" rx="28" ry="8" fill="#c8e6c9" />
    <path
      d="M40 70 Q38 50 40 30 Q42 50 40 70"
      stroke="#388e3c"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="40" cy="30" r="8" fill="#81c784" />
    <ellipse cx="32" cy="24" rx="6" ry="3" fill="#a5d6a7" />
    <ellipse cx="48" cy="24" rx="6" ry="3" fill="#a5d6a7" />
    <ellipse cx="40" cy="18" rx="4" ry="2" fill="#66bb6a" />
  </svg>
);

export default PlantSVG;
