import { createContext, useState } from "react";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from 'uuid';

export const ToastContext = createContext(null);

const DEFAULT_OPTIONS = {
  style: "info", // info, success, error, warning
  autoDismiss: true,
  autoDismissTimeout: 5000,
  position: "top-right", //top-right, top-center, top-left, bottom-right, bottom-center, bottom-left
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function addToast(
    text,
    { id = uuidv4(), ...userDefinedOptions } = {}
  ) {
    const options = { ...DEFAULT_OPTIONS, ...userDefinedOptions };
    setToasts((currentToasts) => {
      return [...currentToasts, { text, options, id }];
    });

    if (options.autoDismiss) {
      setTimeout(() => removeToast(id), options.autoDismissTimeout);
    }

    return id;
  }

  function removeToast(id) {
    setToasts((currentToasts) => {
      return currentToasts.filter((toast) => toast.id !== id);
    });
  }

  const toastsByPosition = toasts.reduce((grouped, toast) => {
    const { position } = toast.options;
    if (grouped[position] == null) {
      grouped[position] = [];
    }
    grouped[position].push(toast);

    return grouped;
  }, {});

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {createPortal(
        Object.entries(toastsByPosition).map(([position, toasts]) => (
          <div key={position} className={`toast-container ${position}`}>
            {toasts.map((toast) => (
              <Toast
                remove={() => removeToast(toast.id)}
                text={toast.text}
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
}

function Toast({ text, remove, style }) {
  return (
    <div onClick={remove} className={`toast toast-${style}`}>
      {text}
    </div>
  );
}
