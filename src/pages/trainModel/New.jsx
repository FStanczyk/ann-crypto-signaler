import React, { useState, useEffect } from "react";
import MainButton from "../../components/MainButton";
import CardContainer from "../../components/CardContainer";
import urls from "../../urls"
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import PricePlot from "../../components/PricePlot";
import {addNewSector} from "../../services/sectorService"
import {formatDateTime} from "../../services/dateTimeService"
const States = {
    VIEW: 'view',
    SELECT_SECTORS: 'selectSectors'
}
function TrainModelNew() {
        const [files, setFiles] = useState([]);
        const [state, setState] = useState(States.VIEW);
        const [csvData, setCsvData] = useState([]);

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

        const [sectors, setSectors] = useState([]);
    
        const [point1, setPoint1] = useState(null);
        const [point2, setPoint2] = useState(null);
        
        const handlePointClick = (e) => {
            if(state === States.SELECT_SECTORS){
                if (e && e.activePayload && e.activePayload.length > 0) {
                    const clickedData = e.activePayload[0].payload;
                    if (!point1) {
                        setPoint1(clickedData);
                    } else {
                        setPoint2(clickedData);
                    }
                }
            }
        };
        
        useEffect(() => {
            const handleKeyPress = (event) => {
                if (event.key === 'c' || event.key === 'C') {
                    setPoint1(null);
                    setPoint2(null);
                }
                if (event.key === 'q' || event.key === 'Q') {
                    setSectors([]);
                }
                if (event.key === "Enter") {
                    addNewSector(csvData, point1, point2, setSectors, () => {
                        setPoint1(null);
                        setPoint2(null);
                    });
                }
                
            };
            
            window.addEventListener("keydown", handleKeyPress);
            
            return () => {
                window.removeEventListener("keydown", handleKeyPress);
            };
        }, [point1, point2]);
        
    return( 
    <div className="new-model-overlay">
        <CardContainer style={{ padding: 0, position: 'relative'}}>
            <div className="chart-info-container">
                <div className="chart-main-info">{files[0]?.pairLeft}-{files[0]?.pairRight}</div>
                <div className="chart-secondary-info">{files[0]?.timeTicks} Candles</div>
                <div className="chart-tertiary-info">State: {state}</div>
                <div className="chart-tertiary-info">
                    Current sector: {point1 && <span>{formatDateTime(point1.datetime, files[0]?.timeTicks)} -</span>}
                    {point2 && <span> {point2.datetime}</span>}
                    {point1 && <div>Press 'C' to reset points.</div>}
                </div>
                <div className="chart-tertiary-info">{sectors.length > 0 ? <>Press 'Q' to remove sectors</> : null}</div>

            </div>
            <PricePlot metadata={files[0]} onClick={handlePointClick} sectors={sectors} point1={point1} point2={point2} csvData={csvData} setCsvData={setCsvData}/>
        </CardContainer>
        <div className="new-model-bottom-container">
            <div className="flex-column">
                <MainButton text="Choose file" link={urls.trainModel.chooseFile} />
                <MainButton text="Load file" link={urls.trainModel.loadFile} />
                <MainButton 
                    text={state === 'selectSectors' ? 'View mode' : 'Select buy sectors'} 
                    onClick={() => setState(state === States.SELECT_SECTORS ? States.VIEW : States.SELECT_SECTORS)} 
                />
                <MainButton text="Save as training file" link={urls.trainModel.save} />
            </div>
            <div className="new-model-cards-flex">
                <CardContainer>
                    <h2>Predicted buy sectors: <span className='green'>{sectors.length}</span></h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Datetime</th>
                                <th>Avg Price {files[0]?.pairRight}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sectors.map((sector, index) => (
                                <tr key={index}>
                                    <td>{formatDateTime(sector.point1.datetime, files[0]?.timeTicks)} - 
                                        {formatDateTime(sector.point2.datetime, files[0]?.timeTicks)}</td>
                                    <td className='col-avg-price'>{sector.mean}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContainer>
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