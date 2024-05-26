import { createContext, useContext, useState } from 'react';

const HeatmapTooltipContext = createContext();

export const HeatmapTooltipContextProvider = ({ children }) => {
    const [tooltipDate, setTooltipDate] = useState(null);
    const [tooltipContent, setTooltipContent] = useState(null);
    const [tooltipUser, setTooltipUser] = useState(null);

    const value = {
        tooltipDate,
        setTooltipDate,
        tooltipContent,
        setTooltipContent,
        tooltipUser,
        setTooltipUser
    }; 

    return (
        <HeatmapTooltipContext.Provider value={value}>
            {children}
        </HeatmapTooltipContext.Provider>
    );
};

export const useHeatmapContext = () => useContext(HeatmapTooltipContext);
