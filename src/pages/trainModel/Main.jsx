import React, { useState } from "react";
import MainButton from "../../components/MainButton";
import PricePlot from "../../components/PricePlot";
import CardContainer from "../../components/CardContainer";
import ListOption from "../../components/ListOption";


function TrainModelMainPage() {
    const [activeOption, setActiveOption] = useState(null);

    const handleOptionClick = (option) => {
        setActiveOption(option);
    };

    return( 
    <div className="train-model-main-overlay">
        <div className="flex-column">
            <MainButton text="Load model" link="/" disabled={!activeOption}/>
            <MainButton text="Train new model" link="/trainModel/new" />
        </div>
        <div className='train-model-cards-flex'>
            <CardContainer className="flex-column">
                <h2>Load existing model</h2>
                <ListOption 
                        text="XRP_USDT 4h 2025-03-4" 
                        additionalClassName={activeOption === "1" ? "active" : ''} 
                        onClick={() => handleOptionClick("1")}
                    />
                <ListOption 
                        text="XRP_USDT 4h 2025-03-4" 
                        additionalClassName={activeOption === "12" ? "active" : ''} 
                        onClick={() => handleOptionClick("12")}
                    />
            </CardContainer>
            <CardContainer>
                <h2>Training files in <span className="green">model</span></h2>
            </CardContainer>
        </div>
        <div className="flex-column">
            <MainButton text="Back" link="/" />
        </div>
    </div>
    );
}
  

export default TrainModelMainPage;