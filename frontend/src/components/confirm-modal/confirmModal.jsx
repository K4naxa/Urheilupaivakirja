import { useEffect } from "react";
import { createPortal } from "react-dom";
import cc from "../../utils/cc";

const ConfirmModal = ({
  isOpen,
  onDecline,
  onAgree,
  agreeButton,
  agreeStyle,
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

  const defaultStyle = "bg-primaryColor border-primaryColor text-white";
  const redStyleClass = "bg-btnRed border-btnRed hover:bg-red-800 text-white";
  const grayStyleClass =
    "bg-btnGray border-btnGray hover:bg-gray-600 text-white";

  return (
    isOpen &&
    createPortal(
      <div
        className="fixed flex items-center justify-center top-0 left-0 w-screen h-screen bg-modalPrimary bg-opacity-50 text-textPrimary z-150"
        onClick={closeOnOutsideClick ? onDecline : undefined}
      >
        <div
          className="flex max-w-[420px] flex-col bg-bgSecondary gap-4 p-6 m-4 rounded-md shadow-lg border border-borderPrimary"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <p className="text-center">{text}</p>
          <div className="flex justify-center gap-8">
            <button
              className="w-20 py-1.5 border rounded-md border-borderPrimary hover:bg-borderPrimary"
              onClick={onDecline}
            >
              {declineButton}
            </button>
            <button
              className={cc(
                "w-20 py-1.5 border rounded-md border-borderPrimary",

                !agreeStyle && defaultStyle,
                agreeStyle === "red" && redStyleClass,
                agreeStyle === "gray" && grayStyleClass
              )}
              onClick={onAgree}
            >
              {agreeButton}
            </button>
          </div>
        </div>
      </div>,
      document.getElementById("confirm-modal-container")
    )
  );
};

export default ConfirmModal;
