import React, { useState, useEffect } from "react";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";

function PricePlot({metadata, onClick, sectors, point1, point2, csvData, setCsvData}) {

    const [csvFileName, setCsvFileName] = useState("file.csv");


    const csvFilePath = metadata?.tauriDataPath;

    useEffect(() => {
      const handleLoadFile = async () => {
          try {
              const content = await readTextFile(csvFilePath, { dir: BaseDirectory.AppData });
              const rows = content.split("\n").slice(1);
              const parsedData = rows.map(row => {
                  const [datetime, open, high, low, close] = row.split(",");
                  return {
                      datetime: new Date(parseInt(datetime)).toLocaleDateString(), 
                      close: parseFloat(close),
                  };
              }).filter(item => !isNaN(item.close));

              setCsvData(parsedData);
          } catch (error) {
              console.error("Error loading CSV file:", error);
          }
      };

        handleLoadFile();
    }, [csvFilePath, setCsvData]);


    const isInDateRange = (date, start, end) => {
        const currentDate = new Date(date);
        return currentDate >= new Date(start) && currentDate <= new Date(end);
    };

    const isInSectorRange = (date) => {
        if (!Array.isArray(sectors) || sectors.length === 0) return false;
        return sectors.some(({ point1, point2 }) =>
            new Date(date) >= new Date(point1.datetime) &&
            new Date(date) <= new Date(point2.datetime)
        );
    };

    const getHighlightedData = (data) => {
        return data.map(item => ({
            ...item,
            sectorClose: isInSectorRange(item.datetime) ? item.close : null, // Use a unique key
        }));
    };


    const strokeColor = 'hsl(0, 6%, 9%);'
    const ticksColor = 'hsl(0, 0%, 58%);'
    const forestGreen = 'hsl(124, 100%, 29%);'
    return (
        csvData ?( 
            <ResponsiveContainer width="100%" height="100%" >
            <LineChart
              width={500}
              height={300}
              data={csvData}
              margin={{
                  right: 35
              }}
              onClick={onClick} 
            >
            <CartesianGrid 
              strokeLinecap 
              horizontal={false}
              stroke={strokeColor}
              strokeWidth={3}
              activeDot={'hsl(27, 67%, 43%)'}
            />

            <XAxis 
                dataKey="datetime" 
                stroke={ticksColor} 
                axisLine={false} 
                tickLine={false}
            />
            <YAxis stroke={ticksColor} axisLine={false} tickLine={false}/>
            <Tooltip />
                <Line
                    type="monotone"
                    dataKey="close"
                    stroke="hsl(84, 8%, 88%)"
                    dot={false}
                    activeDot={{ r: 4 }}
                    strokeWidth={5}
                />
                <Line
                    type="monotone"
                    data={getHighlightedData(csvData)}
                    dataKey="sectorClose"
                    stroke={forestGreen} // Green color
                    dot={false}
                    strokeWidth={4}
                />
            </LineChart>
        </ResponsiveContainer>
        ) : ''
  );
}

export default PricePlot;
