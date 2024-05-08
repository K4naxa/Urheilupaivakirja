import { useEffect, useState } from 'react';

const Toast = ({ text, onDone, style }) => {
    const [isVisible, setIsVisible] = useState(true);
  
    const hideToast = () => {
      setIsVisible(false);
    };
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        hideToast();
      }, 4500);
  
      return () => clearTimeout(timeout);
    }, []);
  
    useEffect(() => {
      if (!isVisible) {
        const timeout = setTimeout(() => {
          onDone();
        }, 300); 
        return () => clearTimeout(timeout);
      }
    }, [isVisible, onDone]);
  
    return (
      <div onClick={hideToast} className={`toast toast-${style} ${isVisible ? 'fade-in' : 'fade-out'}`}>
        {text}
      </div>
    );
  }
  
export default Toast;