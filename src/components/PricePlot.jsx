import React, { useState, useEffect } from "react";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";

function PricePlot({metadata}) {

    const [csvData, setCsvData] = useState(null);
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
  }, [csvFilePath]);

    console.log(csvData)
    const strokeColor = 'hsl(0, 6%, 9%);'
    const ticksColor = 'hsl(0, 0%, 58%);'
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
            </LineChart>
        </ResponsiveContainer>
        ) : ''
  );
}

export default PricePlot;
