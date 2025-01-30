import { createContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from "uuid";
import Toast from "./Toast";

export const ToastContext = createContext(null);

const DEFAULT_OPTIONS = {
  style: "info",
  autoDismiss: true,
  autoDismissTimeout: 5000,
  position: "top-right",
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (text, { id = uuidv4(), ...userDefinedOptions } = {}) => {
    const options = { ...DEFAULT_OPTIONS, ...userDefinedOptions };
    setToasts((currentToasts) => [
      ...currentToasts,
      { text, options, id, isVisible: true },
    ]);

    if (options.autoDismiss) {
      setTimeout(() => markToastForRemoval(id), options.autoDismissTimeout);
    }
  };

  const markToastForRemoval = (id) => {
    setToasts((currentToasts) =>
      currentToasts.map((toast) =>
        toast.id === id ? { ...toast, isVisible: false } : toast
      )
    );
  };

  useEffect(() => {
    if (toasts.every((toast) => !toast.isVisible) && toasts.length > 0) {
      setToasts([]);
    }
  }, [toasts]);

  const toastsByPosition = toasts.reduce((grouped, toast) => {
    const { position } = toast.options;
    grouped[position] = grouped[position] || [];
    grouped[position].push(toast);
    return grouped;
  }, {});

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
      {createPortal(
        Object.entries(toastsByPosition).map(([position, toasts]) => (
          <div key={position} className={`toast-container ${position}`}>
            {toasts.map((toast) => (
              <Toast
                text={toast.text}
                onDone={() => markToastForRemoval(toast.id)}
                style={toast.options.style}
                key={toast.id}
              />
            ))}
          </div>
        )),
        document.getElementById("toast-container")
      )}
    </ToastContext.Provider>
  );
};
