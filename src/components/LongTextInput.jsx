import React from "react";

function LongTextInput({ 
  value = "", 
  additionalClassName = "", 
  disabled = false, 
  onChange, 
  label, 
  fullWidth = true 
}) {
  return (
    <div>
      <div className="simple-input-label">{label}</div>
      <textarea 
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

export default LongTextInput;
