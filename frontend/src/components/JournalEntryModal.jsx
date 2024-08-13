import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const JournalEntryModal = ({ isOpen, onClose, content }) => {
  useEffect(() => {
    // ESC to close
    const handleEscape = (event) => {
      if (event.keyCode === 27) onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";

      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "auto";
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-20 flex items-start justify-center overflow-hidden bg-black bg-opacity-50">
      <div className="w-full h-full sm:w-auto sm:h-auto sm:rounded-md sm:shadow-lg overflow-hidden flex flex-col sm:mt-[8vh]">
        <div className="flex flex-col h-full max-h-full sm:max-h-[90vh] overflow-auto">
          {content}
        </div>
      </div>
    </div>,
    document.getElementById("big-modal-container")
  );
};

export default JournalEntryModal;
