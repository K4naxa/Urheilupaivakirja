import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import cc from "../../utils/cc";
import { useConfirmModal } from "../../hooks/useConfirmModal";

const MergeConfirmModal = ({
  onDecline,
  onAgree,
  typeTextNominative,
  typeTextIllative,
  agreeButtonText,
  declineButtonText,
  text,
  closeOnOutsideClick = true,
  thatMerges,
  useTimer = false,
  mergeToOptions,
}) => {
  const [timer, setTimer] = useState(useTimer ? 3 : 0);
  const [isDisabled, setIsDisabled] = useState(useTimer);
  const [selectedOption, setSelectedOption] = useState(""); // No default selection
  const { openConfirmModal } = useConfirmModal();

  const filteredMergeOptions = mergeToOptions.filter(
    (option) => option.id !== thatMerges.id
  );

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
      if (e.key === "Enter" && !isDisabled && selectedOption) {
        handleAgree();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDisabled, selectedOption]);

  const handleAgree = () => {
    const mergedIntoEntity = mergeToOptions.find(
      (option) => option.id === Number(selectedOption)
    );

    const modalText = (
      <span>
        Kaikki <strong>{thatMerges.student_count}</strong> oppilasta, joiden {typeTextNominative} on
        <br />
        <strong>{thatMerges.name} </strong>
        <br />
        siirretään {typeTextIllative}
        <br />
        <strong>{mergedIntoEntity.name}</strong>.
        <br />
      </span>
    );

    openConfirmModal({
      type: "default",
      text: modalText,
      onAgree: () => {
        onAgree(selectedOption); 
        setTimeout(() => {
            onDecline();
          }, 0)
      },
      agreeButtonText: "Varmista",
      declineButtonText: "Peruuta",
      agreeStyle: "red",
      useTimer: true,
      timerDuration: 5,
    });
  };

  const defaultStyle =
    "bg-primaryColor border-primaryColor hover:bg-hoverPrimary text-white";

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

        {/* Dropdown for selecting the entity to merge into */}
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="w-full border bg-bgPrimary text-textPrimary border-borderPrimary p-2 rounded-md"
        >
          <option value="" disabled>
            Valitse kohde
          </option>
          {filteredMergeOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>

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
              defaultStyle,
              (isDisabled || !selectedOption) && "disabledStyle"
            )}
            onClick={!isDisabled && selectedOption ? handleAgree : undefined}
            disabled={isDisabled || !selectedOption} // Disable if no option is selected
          >
            {isDisabled ? `${agreeButtonText} (${timer})` : agreeButtonText}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("confirm-modal-container")
  );
};

export default MergeConfirmModal;
