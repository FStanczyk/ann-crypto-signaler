export const formatDateTime = (datetime, timeTicks) => {
    const date = new Date(datetime);
    
    if (timeTicks === '1D' || timeTicks === '1T') {
        return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    } 
    
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }) + 
           ' - ' + 
           date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};