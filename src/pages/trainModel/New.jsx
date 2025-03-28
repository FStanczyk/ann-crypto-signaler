import React, { useState, useEffect } from "react";
import MainButton from "../../components/MainButton";
import CardContainer from "../../components/CardContainer";
import urls from "../../urls"
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import PricePlot from "../../components/PricePlot";
function TrainModelNew() {
        const [files, setFiles] = useState([]);

        useEffect(() => {
            const loadFiles = async () => {
                try {
                    const fileContent = await readTextFile("filesMetadata.json", { dir: BaseDirectory.AppData });
    
                    if (fileContent.trim()) {
                        setFiles(JSON.parse(fileContent));
                    }
                } catch (error) {
                    if (error.code === "NotFound") {
                        console.warn("Metadata file not found, initializing empty list.");
                        setFiles([]);
                    } else {
                        console.error("Error reading file metadata:", error);
                    }
                }
            };
            loadFiles();
        }, []);
    

    return( 
    <div className="new-model-overlay">
        <CardContainer style={{ padding: 0, position: 'relative'}}>
            <div className="chart-info-container">
                <div className="chart-main-info">{files[0]?.pairLeft}-{files[0]?.pairRight}</div>
                <div className="chart-secondary-info">{files[0]?.timeTicks} Candles</div>
                <div className="chart-secondary-info"></div>
                <div className="chart-secondary-info"></div>
            </div>
            <PricePlot metadata={files[0]}/>
        </CardContainer>
        <div className="new-model-bottom-container">
            <div className="flex-column">
                <MainButton text="Choose file" link={urls.trainModel.chooseFile} />
                <MainButton text="Load file" link={urls.trainModel.loadFile} />
                <MainButton text="Select buy sectors" />
                <MainButton text="Save as training file" link={urls.trainModel.save} />
            </div>
            <div className="new-model-cards-flex">
                <CardContainer></CardContainer>
                <CardContainer></CardContainer>
                <CardContainer></CardContainer>
            </div>
            <div className="flex-column">
                <MainButton text="Back" link="/" />
            </div>
        </div>
    </div>
    );
}
  

export default TrainModelNew;