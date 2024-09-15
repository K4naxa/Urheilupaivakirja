import { createContext, useContext, useState, useEffect } from 'react';

const HeatmapTooltipContext = createContext();

export const HeatmapTooltipContextProvider = ({ children }) => {
    const [tooltipDate, setTooltipDate] = useState(null);
    const [tooltipContent, setTooltipContent] = useState(null);
    const [tooltipUser, setTooltipUser] = useState(null);

    const clearTooltipContent = () => {
        setTooltipContent("");
    };

    const value = {
        tooltipDate,
        setTooltipDate,
        tooltipContent,
        setTooltipContent,
        tooltipUser,
        setTooltipUser,
        clearTooltipContent
    }; 

    useEffect(() => {
    }, [tooltipContent]);

    return (
        <HeatmapTooltipContext.Provider value={value}>
            {children}
        </HeatmapTooltipContext.Provider>
    );
};

// Custom hook to use the Heatmap context
export const useHeatmapContext = () => useContext(HeatmapTooltipContext);
