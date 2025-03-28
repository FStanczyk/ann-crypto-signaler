import React, { useState, useEffect } from "react";
import MainButton from "../../components/MainButton";
import CardContainer from "../../components/CardContainer";
import urls from "../../urls"
import SimpleInput from '../../components/SimpleInput'
import LongTextInput from '../../components/LongTextInput'
import { writeTextFile, BaseDirectory, readTextFile, copyFile } from '@tauri-apps/api/fs';
import { open } from "@tauri-apps/api/dialog";
import { useNavigate } from "react-router-dom";

function LoadDataFile() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [filePath, setFilePath] = useState("");
    const [pairLeft, setPairLeft] = useState("");
    const [pairRight, setPairRIght] = useState("");
    const [timeTick, setTimeTick] = useState("");
    const [description, setDescription] = useState("");

    const selectFile = async () => {
      try {
        const selected = await open({
          multiple: false,
          filters: [{ name: "CSV Files", extensions: ["csv"] }],
        });

        if (selected) {
          setFilePath(selected);
        }
      } catch (error) {
        console.error("Error selecting file:", error);
      }
    };

    const onSubmit = async () => {
      if (!filePath) {
        console.error("No file selected.");
        return;
      }
    
      try {
        const fileContent = await readTextFile(filePath);
        const rows = fileContent.split("\n").filter(row => row.trim() !== "");
    
        if (rows.length < 2) {
          console.error("CSV file does not contain enough data.");
          return;
        }

        const firstRow = rows[1].split(",")[0];
        const lastRow = rows[rows.length - 1].split(",")[0];
    
        const metadata = {
          filePath,
          name,
          pairLeft,
          pairRight,
          timeTicks: timeTick,
          description,
          createdAt: new Date().toISOString(),
          startTime: firstRow,
          endTime: lastRow,
        };
    
        let existingData = [];
        try {
          const json = await readTextFile("filesMetadata.json", { dir: BaseDirectory.AppData });
    
          if (json.trim()) {
            existingData = JSON.parse(json);
          }
        } catch (readError) {
          if (readError.code !== "NotFound") {
            throw readError;
          }
        }
    
        const fileName = `${name}.csv`;
        const destinationPath = `data/${fileName}`;
        await writeTextFile(destinationPath, fileContent, { dir: BaseDirectory.AppData });
    
        metadata.tauriDataPath = destinationPath;
        existingData.push(metadata);
    
        await writeTextFile("filesMetadata.json", JSON.stringify(existingData, null, 2), { dir: BaseDirectory.AppData });
    
        console.log("Metadata saved successfully:", metadata);
        navigate(urls.trainModel.save);
      } catch (error) {
        console.error("Error processing CSV file:", error);
      }
    };
    

    return( 
        <div className="load-file-container">
            <CardContainer><p></p>
            <h2>Load new training file</h2>
            <MainButton text="Select file" onClick={selectFile}/>
              <SimpleInput 
                  label="File path"
                  value={filePath}
                  disabled={true}
              />
            <SimpleInput 
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div className="load-file-pair-container">
                    <SimpleInput 
                      label="Pair"
                      value={pairLeft}
                      onChange={(e) => setPairLeft(e.target.value)}
                    />
                    <h2>/</h2>
                    <SimpleInput 
                      label="__"
                      hideLabel
                      value={pairRight}
                      onChange={(e) => setPairRIght(e.target.value)}
                    />
                </div>
            <SimpleInput 
                    label="Time tick"
                    value={timeTick}
                    onChange={(e) => setTimeTick(e.target.value)}
                />
            <LongTextInput 
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </CardContainer>
            <div className="vert-flex-buttons">
                <MainButton text="Save" onClick={onSubmit}/>
                <MainButton text="Back" link={urls.trainModel.new} />
            </div>
        </div>
    );
}
  

export default LoadDataFile;