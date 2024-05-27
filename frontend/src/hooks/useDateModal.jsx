import { createContext, useContext, useState } from 'react';

const DateModalContext = createContext();

export const useDateModal = () => {
  const value = useContext(DateModalContext);

  if ( value == null) {
   throw new Error("useToast must be used within a <ToastProvider>");   
  }

  return value;
}

export const DateModalProvider = ({ children }) => {
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [dateModalPos, setDateModalPos] = useState({ x: 0, y: 0 , arrowLeft: 0});
  const [selectedDate, setSelectedDate] = useState(null);

  const showDateModal = (left, top, arrowLeft, date) => {
    
    console.log("arrowLeft in useModal", arrowLeft);

    setDateModalPos({ x: left, y: top, arrowLeft });
    setSelectedDate(date);
    setDateModalOpen(true);
  };

  const hideDateModal = () => {
    setDateModalOpen(false);
  };

  return (
    <DateModalContext.Provider value={{ dateModalOpen, dateModalPos, selectedDate, showDateModal, hideDateModal }}>
      {children}
    </DateModalContext.Provider>
  );
};
