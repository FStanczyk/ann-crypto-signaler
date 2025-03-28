import React from "react";

function CardContainer({ children, className, style=null }) {
  return (
    <div className={`cardFudament ${className}`} style={style}>
      {children}
    </div>
  );
}

export default CardContainer;