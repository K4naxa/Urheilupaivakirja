import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import cc from "../../utils/cc";

const ConfirmModal = ({
  onDecline,
  onAgree,
  agreeButtonText,
  agreeStyle,
  declineButtonText,
  text,
  closeOnOutsideClick = true,
  useTimer = false,
  oldValue,
  newValue
}) => {
  const [timer, setTimer] = useState(useTimer ? 3 : 0);
  const [isDisabled, setIsDisabled] = useState(useTimer);

  useEffect(() => {
    let interval = null;
    if (useTimer && isDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isDisabled, useTimer]);

  useEffect(() => {
    if (timer === 0 && isDisabled) {
      setIsDisabled(false);
    }
  }, [timer, isDisabled]);
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
      if (e.key === "Enter" && !isDisabled) {
        onAgree();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onAgree, isDisabled]);

  const defaultStyle =
    "bg-primaryColor border-primaryColor hover:bg-hoverPrimary text-white";
  const redStyleClass = "bg-btnRed border-btnRed hover:bg-red-800 text-white";
  const grayStyleClass =
    "bg-bgGray border-borderPrimary hover:bg-hoverGray text-textPrimary";

  return createPortal(
    <div
      className="fixed flex items-center justify-center top-0 left-0 w-screen h-screen bg-modalPrimary bg-opacity-50 text-textPrimary z-50"
      onClick={closeOnOutsideClick ? onDecline : undefined}
    >
      <div
        className="flex max-w-[420px] flex-col bg-bgSecondary gap-4 p-6 m-4 rounded-md shadow-lg border border-borderPrimary"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-center">{text}</p>
        <div className="flex justify-center gap-8">
          <button
            className="w-20 py-1.5 border rounded-md border-borderPrimary hover:bg-hoverDefault"
            onClick={onDecline}
          >
            {declineButtonText}
          </button>
          <button
            className={cc(
              "w-20 py-1.5 border rounded-md border-borderPrimary",
              !agreeStyle && defaultStyle,
              agreeStyle === "red" && redStyleClass,
              agreeStyle === "gray" && grayStyleClass,
              isDisabled && "disabledStyle"
            )}
            onClick={!isDisabled ? onAgree : undefined}
            disabled={isDisabled}
          >
            {isDisabled ? `${agreeButtonText} (${timer})` : agreeButtonText}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("confirm-modal-container")
  );
};

export default ConfirmModal;
