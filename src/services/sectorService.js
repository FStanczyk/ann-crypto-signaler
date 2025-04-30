export const addNewSector = (csvData, point1, point2, setSectors, resetPoints) => {
    if (point1 && point2) {
        let start = new Date(point1.datetime);
        let end = new Date(point2.datetime);

        // Swap if point2 is earlier than point1
        if (start > end) {
            [start, end] = [end, start];
            [point1, point2] = [point2, point1];
        }

        const selectedData = csvData.filter((entry) => {
            const entryDate = new Date(entry.datetime);
            return entryDate >= start && entryDate <= end;
        });

        if (selectedData.length > 0) {
            const closeValues = selectedData.map((entry) => entry.close);

            const maxClose = Math.max(...closeValues);
            const minClose = Math.min(...closeValues);
            const avgClose = closeValues.reduce((sum, val) => sum + val, 0) / closeValues.length;

            let newSector = {
                point1: { ...point1 },
                point2: { ...point2 },
                max: maxClose,
                min: minClose,
                mean: avgClose.toFixed(2),
            };

            setSectors((prevSectors) => {
                let updatedSectors = [];
                let merged = false;

                prevSectors.forEach((sector) => {
                    const existingStart = new Date(sector.point1.datetime);
                    const existingEnd = new Date(sector.point2.datetime);
                    const newStart = new Date(newSector.point1.datetime);
                    const newEnd = new Date(newSector.point2.datetime);

                    if (newStart <= existingEnd && newEnd >= existingStart) {
                        // Merge overlapping sectors
                        newSector.point1.datetime = new Date(Math.min(existingStart, newStart)).toISOString();
                        newSector.point2.datetime = new Date(Math.max(existingEnd, newEnd)).toISOString();
                        newSector.max = Math.max(sector.max, newSector.max);
                        newSector.min = Math.min(sector.min, newSector.min);

                        const totalMean = (parseFloat(sector.mean) + parseFloat(newSector.mean)) / 2;
                        newSector.mean = totalMean.toFixed(2);

                        merged = true;
                    } else {
                        updatedSectors.push(sector);
                    }
                });

                updatedSectors.push(newSector);
                return updatedSectors;
            });

            if (resetPoints) resetPoints();
        }
    }
};
