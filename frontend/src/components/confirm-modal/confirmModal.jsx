import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const ConfirmModal = ({
  isOpen,
  onDecline,
  onAgree,
  children,
  closeOnOutsideClick = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onDecline();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onDecline]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (onAgree) {
          onAgree();
        } else {
          onDecline();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onAgree, onDecline]);

  return createPortal(
    <div
      className={`modal-overlay ${isOpen ? "show" : ""}`}
      onClick={closeOnOutsideClick ? onDecline : undefined}
    >
      <div
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>,
    document.getElementById("confirm-modal-container")
  );
};

export { ConfirmModal };
