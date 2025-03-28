import React from "react";

function SimpleInput({ 
  value = "", 
  additionalClassName = "", 
  disabled = false, 
  onChange,
  label,
  fullWidth=true,
  hideLabel=false
}) {
  return (
    <div>
        <div className={`simple-input-label ${hideLabel ? "hidden" : ""}`}>{label}</div>
    <input 
      type="text"
      className={`
        simple-input 
        ${additionalClassName} 
        ${disabled ? "disabled" : ""}
        ${fullWidth ? "fullWidth" : ""}
        `} 
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
    </div>
  );
}

export default SimpleInput;