import React from "react";
import MainButton from "../components/MainButton";
function MainPage() {
    return(
        <div className='main-page-buttons'>
            <MainButton text="Train model" link="/trainModel"/>
            <MainButton text="Test model"  />
            <MainButton text="Settings" />
        </div>
    )
    ;
}
  

export default MainPage;