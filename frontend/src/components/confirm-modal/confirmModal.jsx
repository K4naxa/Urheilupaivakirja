import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const ConfirmModal = ({
  isOpen,
  onDecline,
  onAgree,
  agreeButton,
  declineButton,
  text,
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

  return isOpen && createPortal(
    <div
      className="fixed flex items-center justify-center top-0 left-0 w-screen h-screen bg-modalPrimary bg-opacity-50 text-textPrimary z-150"
      onClick={closeOnOutsideClick ? onDecline : undefined}
    >
      <div
        className="flex max-w-[420px] flex-col bg-bgkSecondary gap-2 p-8 m-4 rounded-md shadow-md"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <p>{text}</p>
        <div className="flex justify-center gap-8 mt-4">
        <button className="w-20 py-1.5 border rounded-md border-borderPrimary bg-headerPrimary" onClick={onAgree}>{agreeButton}</button>
        <button className="w-20 py-1.5 border rounded-md border-borderPrimary bg-btnGray" onClick={onDecline}>{declineButton}</button>
        </div>
      </div>
    </div>,
    document.getElementById("confirm-modal-container")
  );
};

export { ConfirmModal };
