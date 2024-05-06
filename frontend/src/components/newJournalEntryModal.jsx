import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const NewJournalEntryModal = ({ isOpen, onClose, content }) => {
  useEffect(() => {
    // ESC to close
    const handleEscape = (event) => {
      if (event.keyCode === 27) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-2 overflow-hidden">
      <div className="w-full h-full sm:w-auto sm:h-auto sm:rounded-md sm:shadow-lg overflow-hidden flex flex-col">
        {content}
      </div>
    </div>,
    document.getElementById("big-modal-container")
  );
};

export default NewJournalEntryModal;
