import { useState, useRef, createRef } from "react";
import { useToast } from "../hooks/toast-messages/useToast";

const OTPInput = ({ length, onComplete }) => {
  const [inputs, setInputs] = useState(Array(length).fill(""));
  const inputRefs = useRef(inputs.map(() => createRef()));
  const { addToast } = useToast();

  const updateInputs = (value, index) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const isFilled = () => inputs.every((input) => input.trim() !== "");

  const handleInputChange = (event, index) => {
    updateInputs(event.target.value, index);
  };

  const handleInput = (event, index) => {
    if (event.target.value && index < length - 1) {
      focusAndSelect(index + 1);
    }
  };

  const handleKeyDown = (event, index) => {
    switch (event.key) {
      case "Backspace": {
        if (!inputs[index] && index > 0) {
          focusAndSelect(index - 1);
        }
        break;
      }
      case "ArrowLeft": {
        if (index > 0) {
          focusAndSelect(index - 1);
        }
        break;
      }
      case "ArrowRight": {
        if (index < length - 1) {
          focusAndSelect(index + 1);
        }
        break;
      }
      case "Enter": {
        handlePost();
        break;
      }
      default:
        break;
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    let pasteData = e.clipboardData.getData("text");
    pasteData = pasteData.replace(/\s+/g, "").slice(0, length);
    if (pasteData.length === length) {
      const newInputs = pasteData.split("");
      setInputs(newInputs);
      onComplete(pasteData);
    }
  };

  const handleFocus = (event) => {
    event.target.select();
  };

  const handlePost = () => {
    if (isFilled()) {
      onComplete(inputs.join(""));
    }
    else {
        addToast("Täytä kaikki kentät", { style: "error" });
    }
  }


  const focusAndSelect = (index) => {
    const input = inputRefs.current[index].current;
    input.focus();
    setTimeout(() => input.select(), 0);
  };

  return (
    <>
      <div className="flex w-full justify-between">
        {inputs.map((input, index) => (
          <input
            className="bg-bgkPrimary text-center w-[40px] h-[40px] rounded border border-borderPrimary"
            key={index}
            ref={inputRefs.current[index]}
            type="text"
            maxLength={1}
            value={input}
            onChange={(e) => handleInputChange(e, index)}
            onInput={(e) => handleInput(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            onFocus={handleFocus}
          />
        ))}
      </div>
      <button
        onClick={handlePost}
        className="ml-4 px-3 py-1 border rounded text-white bg-blue-500"
      >
        Verify
      </button>
    </>
  );
};

export default OTPInput;
