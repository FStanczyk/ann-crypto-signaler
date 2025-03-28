import React from "react";

function MainButton({ 
    text, 
    onClick = () => {}, 
    disabled = false,
    additionalClassName = "" }) {

  return (
    <div 
        className={`list-option ${additionalClassName} ${disabled ? "disabled" : ""}`}
        onClick={!disabled ? onClick : undefined}
    >
      {text}
    </div>
  );
}

export default MainButton;
