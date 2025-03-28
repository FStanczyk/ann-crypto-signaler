import React from "react";
import { useNavigate } from "react-router-dom";
function MainButton({ 
  text, 
  onClick = () => {}, 
  link = null, 
  additionalClassName = "",
  disabled=false
}) {
  const navigate = useNavigate();

  const onButtonClick = link
    ? () => {
        onClick();
        navigate(link);
      }
    : onClick; 

  return (
    <button 
      className={`main-button ${additionalClassName} ${disabled ? "disabled" : ""}`} 
      onClick={!disabled ? onButtonClick : undefined}
    >
      {text}
    </button>
  );
}

export default MainButton;
