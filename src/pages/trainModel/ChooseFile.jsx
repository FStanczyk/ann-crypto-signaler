import React, { useState, useEffect } from "react";
import MainButton from "../../components/MainButton";
import CardContainer from "../../components/CardContainer";
import urls from "../../urls";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import SimpleInput from "../../components/SimpleInput";
import LongTextInput from "../../components/LongTextInput";
import ListOption from "../../components/ListOption";


const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";

    return new Date(timestamp).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).replace(",", " -");
};

function ChooseFile() {
    const [activeOption, setActiveOption] = useState(null);
    const [files, setFiles] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedFile, setEditedFile] = useState(null);

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

    const handleOptionClick = (index) => {
        setActiveOption(index);
        setEditedFile({ ...files[index] }); // Copy selected file for editing
        setIsEditing(false); // Reset edit mode
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        if (activeOption === null) return;

        const updatedFiles = [...files];
        updatedFiles[activeOption] = editedFile;

        try {
            await writeTextFile("filesMetadata.json", JSON.stringify(updatedFiles, null, 2), { dir: BaseDirectory.AppData });
            setFiles(updatedFiles);
            setIsEditing(false);
            console.log("File metadata updated successfully.");
        } catch (error) {
            console.error("Error saving edited metadata:", error);
        }
    };

    const handleDeleteClick = async () => {
        if (activeOption === null) return;

        const updatedFiles = files.filter((_, index) => index !== activeOption);

        try {
            await writeTextFile("filesMetadata.json", JSON.stringify(updatedFiles, null, 2), { dir: BaseDirectory.AppData });
            setFiles(updatedFiles);
            setActiveOption(null);
            setIsEditing(false);
            console.log("File deleted successfully.");
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    return (
        <div className="train-model-main-overlay">
            <div className="flex-column">
                <MainButton text="Use file" link="/trainModel/new" />
            </div>
            <div className="train-model-cards-flex">
                <CardContainer className="flex-column">
                    <h2>Choose file</h2>
                    {files.map((file, index) => (
                        <ListOption
                            key={index}
                            text={file.name || "Unnamed File"}
                            additionalClassName={activeOption === index ? "active" : ""}
                            onClick={() => handleOptionClick(index)}
                        />
                    ))}
                </CardContainer>
                <CardContainer>
                    <h2>
                        <span className="green">File</span> info
                    </h2>
                    {activeOption !== null && files.length > 0 && files[activeOption] && (
                        <>
                            <SimpleInput
                                label="File path"
                                value={files[activeOption].filePath}
                                disabled={true}
                                onChange={(e) => setEditedFile({ ...editedFile, filePath: e.target.value })}
                            />
                            <SimpleInput
                                label="App data path"
                                value={files[activeOption].tauriDataPath}
                                disabled={true}
                                onChange={(e) => setEditedFile({ ...editedFile, filePath: e.target.value })}
                            />
                            <SimpleInput
                                label="Name"
                                value={isEditing ? editedFile.name : files[activeOption].name || ""}
                                disabled={!isEditing}
                                onChange={(e) => setEditedFile({ ...editedFile, name: e.target.value })}
                            />
                            <div className="load-file-pair-container">
                                <SimpleInput
                                    label="Pair"
                                    value={isEditing ? editedFile.pairLeft : files[activeOption].pairLeft || ""}
                                    disabled={!isEditing}
                                    onChange={(e) => setEditedFile({ ...editedFile, pairLeft: e.target.value })}
                                />
                                <h2>/</h2>
                                <SimpleInput
                                    label="__"
                                    hideLabel
                                    value={isEditing ? editedFile.pairRight : files[activeOption].pairRight || ""}
                                    disabled={!isEditing}
                                    onChange={(e) => setEditedFile({ ...editedFile, pairRight: e.target.value })}
                                />
                            </div>
                            <div className="load-file-pair-container">
                                <SimpleInput 
                                label="Start date"
                                value={formatTimestamp(parseInt(files[activeOption].startTime))}
                                disabled={true}
                                />
                                <h2>-</h2>
                                <SimpleInput 
                                label="End date"
                                hideLabel
                                value={formatTimestamp(parseInt(files[activeOption].endTime))}
                                disabled={true}
                                />
                            </div>
                            <SimpleInput
                                label="Time tick"
                                value={isEditing ? editedFile.timeTicks : files[activeOption].timeTicks || ""}
                                disabled={!isEditing}
                                onChange={(e) => setEditedFile({ ...editedFile, timeTicks: e.target.value })}
                            />
                            <LongTextInput
                                label="Description"
                                value={isEditing ? editedFile.description : files[activeOption].description || ""}
                                disabled={!isEditing}
                                onChange={(e) => setEditedFile({ ...editedFile, description: e.target.value })}
                            />
                            <div className="vert-flex-buttons">
                                {isEditing ? (
                                    <>
                                        <MainButton text="Save" onClick={handleSaveClick} />
                                        <MainButton text="Cancel" onClick={() => setIsEditing(false)} />
                                    </>
                                ) : (
                                    <>
                                        <MainButton text="Edit" onClick={handleEditClick} />
                                        <MainButton text="Delete" onClick={handleDeleteClick} />
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </CardContainer>
            </div>
            <div className="flex-column">
                <MainButton text="Back" link={urls.trainModel.new} />
            </div>
        </div>
    );
}

export default ChooseFile;
