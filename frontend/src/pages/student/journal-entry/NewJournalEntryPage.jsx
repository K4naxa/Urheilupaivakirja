import { useState, useLayoutEffect, useMemo } from "react";
import journalService from "../../../services/journalService.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../hooks/toast-messages/useToast.jsx";
import { FiArrowLeft, FiChevronUp, FiChevronDown } from "react-icons/fi";
import dayjs from "dayjs";
import { useConfirmModal } from "../../../hooks/useConfirmModal.jsx";

//const headerContainer = "bg-primaryColor border-borderPrimary border-b p-5 text-center text-xl shadow-md sm:rounded-t-md";
const inputContainer =
  "flex flex-col p-2 gap-0.5 sm:gap-1 w-full max-w-[370px] p-1";
const inputLabel = "block text-sm font-medium text-textSecondary text-left";
const optionContainer = "grid grid-cols-3 gap-3 justify-between w-full py-1";

const NewJournalEntryPage = ({ onClose, studentData, date }) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const initialDate = date || dayjs(new Date()).format("YYYY-MM-DD");
  const { openConfirmModal } = useConfirmModal();

  const [newJournalEntryData, setNewJournalEntryData] = useState({
    entry_type: "1",
    workout_type: "",
    workout_category: "1",
    length_in_minutes: "60",
    time_of_day: "",
    intensity: "",
    date: initialDate,
    details: "",
  });

  const studentDataLoading = false;
  const [errors, setErrors] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [conflict, setConflict] = useState({
    value: false,
    message: "",
    messageShort: "",
  });
  const [submitButtonIsDisabled, setSubmitButtonIsDisabled] = useState(false);

  const addJournalEntry = useMutation({
    mutationFn: () => journalService.postJournalEntry(newJournalEntryData),
    onError: (error) => {
      console.error("Error posting new journal entry:", error);

      let errorMessage = "Virhe tallentaessa uutta merkintää.";

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage =
              "Virheellinen pyyntö. Tarkista tiedot ja yritä uudelleen.";
            break;
          case 500:
            errorMessage =
              "Palvelinvirhe. Yritä myöhemmin uudelleen. Ongelman jatkuessa ota yhteyttä ylläpitäjään.";
            break;
          default:
            errorMessage = "Tuntematon virhe tapahtui. Yritä uudelleen.";
        }
      }
      addToast(errorMessage, { style: "error" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentData"] });
      addToast("Merkintä lisätty", { style: "success" });
      onClose();
    },
  });

  // Options data for dropdowns
  const {
    data: optionsData,
    isFetching: optionsLoading,
    isError: optionsError,
    error,
  } = useQuery({
    queryKey: ["options"],
    queryFn: () => journalService.getJournalEntryOptions(),
  });

  // get all journal entries for the selected date from cache
  const entriesForSelectedDate = useMemo(() => {
    const filteredEntries =
      studentData.journal_entries
        ?.map((entry) => ({
          ...entry,
          date: formatDateString(entry.date),
        }))
        .filter((entry) => entry.date === newJournalEntryData.date) || [];
    return filteredEntries;
  }, [studentData, newJournalEntryData.date]);

  // check for conflicts when the selected date or entry type changes
  useLayoutEffect(() => {
    checkForConflicts(
      newJournalEntryData.entry_type,
      newJournalEntryData.date,
      entriesForSelectedDate
    );
  }, [
    entriesForSelectedDate,
    newJournalEntryData.entry_type,
    newJournalEntryData.date,
  ]);

  const newJournalEntryHandler = async (e) => {
    e.preventDefault();
    setSubmitButtonIsDisabled(true);

    setErrors("");
    if (!errorCheckJournalEntry()) {
      setSubmitButtonIsDisabled(false);
      return;
    }

    if (conflict.value) {
      openConfirmModal({
        text: conflict.message,
        agreeButtonText: "Jatka",
        declineButtonText: "Peruuta",
        onAgree: handleUserConfirmation,
        closeOnOutsideClick: false,
      });
      setSubmitButtonIsDisabled(false);
      return;
    }
    console.log("submit button state: ", submitButtonIsDisabled);

    try {
      await addJournalEntry.mutateAsync({ newJournalEntryData });

      console.log(
        "submit button state after mutation: ",
        submitButtonIsDisabled
      );
      setSubmitButtonIsDisabled(false);
      console.log(
        "submit button state after setSubmitButtonIsDisabled: ",
        submitButtonIsDisabled
      );
    } catch (error) {
      console.error("Error adding journal entry:", error);
      setSubmitButtonIsDisabled(false);
    }
  };

  const handleUserConfirmation = async () => {
    try {
      await addJournalEntry.mutate({ newJournalEntryData });
    } catch (error) {
      console.error("Error after user confirmation:", error);
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setNewJournalEntryData((newJournalEntryData) => ({
      ...newJournalEntryData,
      [name]: value,
    }));

    if (value.trim() !== "") {
      setErrors((prevErrors) => {
        const { [name]: removedError, ...restErrors } = prevErrors;
        return restErrors;
      });
    }
  };

  const entryTypeChangeHandler = (type) => {
    const newType = newJournalEntryData.entry_type === type ? "1" : type;
    setNewJournalEntryData((prevState) => ({
      ...prevState,
      entry_type: newType,
    }));
  };

  // if workout_type is changed to 1 (akatemia) or 2 (seura), set workout_category to 1 (omalaji)
  const workoutTypeChangeHandler = (e) => {
    const { name, value } = e.target;
    setNewJournalEntryData((prevState) => {
      // Prepare the new state object
      const newState = { ...prevState, [name]: value };
      // If the workout type is "1" or "2", automatically set the workout category
      if (value === "1" || value === "2") {
        // Set workout_category to the first option's ID, assuming optionsData is available
        newState.workout_category =
          optionsData.workout_categories[0].id.toString();
      }
      return newState;
    });
    // Clear any specific errors related to workout type if they exist
    if (value.trim() !== "") {
      setErrors((prevErrors) => {
        const { [name]: removedError, ...restErrors } = prevErrors;
        return restErrors;
      });
    }
  };

  const errorCheckJournalEntry = () => {
    //TODO: regex here
    let hasMissingInputs = false;
    setErrors({});

    const checkIfEmpty = (fieldValue, fieldName) => {
      if (fieldValue === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldName]: true,
        }));
        return true;
      }
      return false;
    };

    const validateDateFormat = (date, fieldName) => {
      const regex = /^\d{4}-\d{2}-\d{2}$/; //YYYY-MM-DD
      if (!regex.test(date)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldName]: true,
        }));
        return true;
      }
      return false;
    };

    // if entry type is not 1, 2 or 3
    if (![1, 2, 3].includes(Number(newJournalEntryData.entry_type))) {
      setErrors((prevErrors) => ({ ...prevErrors, entry_type: true }));
      hasMissingInputs = true;
    }

    hasMissingInputs |= checkIfEmpty(newJournalEntryData.date, "date");
    hasMissingInputs |= validateDateFormat(newJournalEntryData.date, "date");

    if (newJournalEntryData.entry_type === "1") {
      hasMissingInputs |= checkIfEmpty(
        newJournalEntryData.workout_type,
        "workout_type"
      );
      hasMissingInputs |= checkIfEmpty(
        newJournalEntryData.workout_category,
        "workout_category"
      );
      hasMissingInputs |= checkIfEmpty(
        newJournalEntryData.length_in_minutes,
        "length_in_minutes"
      );
      hasMissingInputs |= checkIfEmpty(
        newJournalEntryData.time_of_day,
        "time_of_day"
      );
      hasMissingInputs |= checkIfEmpty(
        newJournalEntryData.intensity,
        "intensity"
      );
    }

    if (hasMissingInputs) {
      addToast("Täytä kaikki kentät", { style: "error" });
      return false;
    }

    return true;
  };

  // check for conflicts between new and existing entries
  const checkForConflicts = (entry_type, inputDate, existingEntries) => {
    setSubmitButtonIsDisabled(false);
    setConflict({ value: false, message: "", messageShort: "" });
    // Check if there are any existing entries on the same date
    const conflictEntry = existingEntries.find(
      (entry) => entry.date === inputDate
    );

    if (!conflictEntry) {
      return false; // No conflict if no entries exist on this date
    }

    if (conflictEntry.entry_type_id == 1 && entry_type == 1) {
      setSubmitButtonIsDisabled(false);
    }
    //if entry type is the same as the existing entry but not an exercise, disable submit button

    if (conflictEntry.entry_type_id == entry_type && entry_type != "1") {
      setSubmitButtonIsDisabled(true);
    }

    // {existing_entry: {new_entry: {message, messageShort}}}
    const conflictMessages = {
      1: {
        // 1: this option does not exist as 1:1 conflict is handled above
        2: {
          message:
            "Päivälle on merkitty yksi tai useampi harjoitus. Päivän merkitseminen lepopäiväksi poistaa päivälle tehdyt harjoitusmerkinnät.",
          messageShort: "Päivälle on merkitty yksi tai useampi harjoitus.",
        },
        3: {
          message:
            "Päivälle on merkitty yksi tai useampi harjoitus. Päivän merkitseminen sairauspäiväksi poistaa päivälle tehdyt harjoitusmerkinnät.",
          messageShort: "Päivälle on merkitty yksi tai useampi harjoitus.",
        },
      },
      2: {
        1: {
          message:
            "Päivä on merkitty lepopäiväksi. Tämän merkinnän lisääminen merkitsee päivän harjoituspäiväksi.",
          messageShort: "Päivä on merkitty lepopäiväksi.",
        },
        2: {
          message: "Päivä on jo merkitty lepopäiväksi.",
          messageShort: "Päivä on jo merkitty lepopäiväksi.",
        },
        3: {
          message:
            "Päivä on merkitty lepopäiväksi. Tämän merkinnän lisääminen merkitsee päivän sairauspäiväksi.",
          messageShort: "Päivä on merkitty lepopäiväksi.",
        },
      },
      3: {
        1: {
          message:
            "Päivä on merkitty sairauspäiväksi. Tämän merkinnän lisääminen merkitsee päivän harjoituspäiväksi.",
          messageShort: "Päivä on merkitty sairauspäiväksi.",
        },
        2: {
          message:
            "Päivä on merkitty sairauspäiväksi. Tämän merkinnän lisääminen merkitsee päivän lepopäiväksi.",
          messageShort: "Päivä on merkitty sairauspäiväksi.",
        },
        3: {
          message: "Päivä on jo merkitty sairauspäiväksi.",
          messageShort: "Päivä on jo merkitty sairauspäiväksi.",
        },
      },
    };

    // Check if the existing entry type is relevant to check against the new entry type
    if (
      conflictMessages[conflictEntry.entry_type_id] &&
      conflictMessages[conflictEntry.entry_type_id][entry_type]
    ) {
      const conflictData =
        conflictMessages[conflictEntry.entry_type_id][entry_type];
      setConflict({
        value: true,
        message: conflictData.message,
        messageShort: conflictData.messageShort,
      });
    }
  };

  const renderRadioButton = (name, value, label, onChangeHandler) => {
    return (
      <div className="relative w-full" key={`${name}-${value}`}>
        <input
          type="radio"
          name={name}
          value={value}
          checked={newJournalEntryData[name] === value}
          id={`${name}-${value}`}
          onChange={onChangeHandler}
          className="absolute w-0 h-0 opacity-0 peer"
          tabIndex="0" // Make sure it's focusable
        />
        <label
          htmlFor={`${name}-${value}`}
          className="block p-2 text-center transition-transform duration-75 border-2 rounded-md cursor-pointer peer-checked:border-primaryColor peer-checked:text-bgSecondary peer-checked:bg-primaryColor bg-bgPrimary peer-focus-visible:ring-2 peer-focus-visible:ring-secondaryColor border-borderPrimary text-textPrimary active:scale-95 hover:border-primaryColor hover:text-primaryColor"
        >
          {label}
        </label>
      </div>
    );
  };

  function convertTime(totalMinutes) {
    if (totalMinutes == 195) {
      return "yli 3h";
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) {
      return `${minutes}min`;
    }
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}min`;
  }

  function getSubmitButtonText(entry_type) {
    switch (entry_type) {
      case "1":
        return "Lisää harjoitus";
      case "2":
        return "Merkitse lepopäiväksi";
      case "3":
        return "Merkitse sairauspäiväksi";
      default:
        return "Lähetä";
    }
  }

  if (optionsLoading || studentDataLoading) {
    return <p>Loading...</p>;
  }

  if (optionsError) {
    return <p>Error: {error?.message || "Unknown error"}</p>;
  }

  function formatDateString(isoDateString) {
    const date = new Date(isoDateString);
    date.setUTCHours(0, 0, 0, 0); // Normalize time to midnight UTC to avoid day roll-over issues

    // Format to 'YYYY-MM-DD'
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return (
    <>
      <div className="flex flex-col h-full overflow-auto transition-transform duration-300 sm:rounded-md hide-scrollbar ">
        <div className="relative p-3 text-xl text-center text-white shadow-md bg-primaryColor sm:p-4 sm:rounded-t-md">
          <p className="sm:min-w-[400px] cursor-default	">Uusi merkintä</p>
          <button
            onClick={onClose}
            className="absolute text-2xl transition-transform duration-150 translate-y-1/2 bottom-1/2 left-5 hover:scale-125"
          >
            <FiArrowLeft />
          </button>
        </div>
        <form
          className="flex flex-col items-center flex-grow gap-2 p-4 md:px-8 bg-bgSecondary sm:rounded-b-md"
          onSubmit={newJournalEntryHandler}
        >
          {/* Entry Type Selection */}
          <div className="flex flex-row justify-centerw-full mt-2 max-w-md gap-8">
            {[
              {
                type: "2",
                label: "Lepopäivä",
                color: "bg-bgRest border-bgRest",
              },
              {
                type: "3",
                label: "Sairauspäivä",
                color: "bg-bgSick border-bgSick",
              },
            ].map(({ type, label, color }) => (
              <button
                key={type}
                type="button"
                onClick={() => entryTypeChangeHandler(type)}
                className={`w-36 py-2 text-sm font-medium text-textPrimary rounded-xl border-2 bg-bgPrimary transition-all duration-150 ${newJournalEntryData.entry_type === type ? `${color}` : " border-borderPrimary"} hover:bg-opacity-20 hover:border-opacity-50 hover:${color} hover:text-textPrimary`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Date Picker */}
          <div className={`${inputContainer} px-2.5`}>
            <label className={inputLabel} htmlFor="date-picker">
              Päivämäärä
            </label>
            <input
              className={`w-full px-3 py-2 mt-1 text-center border-2 border-borderPrimary  rounded-md bg-bgPrimary text-textPrimary focus:outline-none color dark:[color-scheme:dark] focus:ring-2 focus:ring-primaryColor ${errors.date ? "border-red-500" : ""}`}
              type="date"
              name="date"
              value={newJournalEntryData.date}
              onChange={changeHandler}
              id="date-picker"
            />
          </div>

          {/* Workout Details */}
          {newJournalEntryData.entry_type === "1" && (
            <div
              className={`${inputContainer} ${errors.length_in_minutes ? "shadow-error" : ""}`}
            >
              <label className={inputLabel} htmlFor="length_in_minutes">
                Kesto: {convertTime(newJournalEntryData.length_in_minutes)}
              </label>
              <div className="w-full  relative mb-2">
                <input
                  className="w-full h-4 bg-bgPrimary border-2 border-borderPrimary rounded-lg appearance-none  cursor-pointer"
                  type="range"
                  min="30"
                  max="195"
                  value={newJournalEntryData.length_in_minutes}
                  step="15"
                  id="length_in_minutes"
                  onChange={changeHandler}
                  name="length_in_minutes"
                />
                <span className="text-sm text-textSecondary absolute start-[18%] -bottom-4">
                  1h
                </span>
                <span className="text-sm text-textSecondary absolute start-[55%] -translate-x-1/2 rtl:translate-x-1/2 -bottom-4">
                  2h
                </span>
                <span className="text-sm text-textSecondary absolute start-[87%] -bottom-4">
                  3h
                </span>
              </div>
            </div>
          )}
          {newJournalEntryData.entry_type === "1" && (
            <div
              className={`${inputContainer} ${errors.time_of_day ? "shadow-error" : ""}`}
            >
              <label className={inputLabel}>Ajankohta</label>
              <div className={optionContainer}>
                {optionsData.time_of_day.map((time) =>
                  renderRadioButton(
                    "time_of_day",
                    time.id.toString(),
                    time.name,
                    changeHandler
                  )
                )}
              </div>
            </div>
          )}

          {newJournalEntryData.entry_type === "1" && (
            <div
              className={`${inputContainer} ${errors.workout_type ? "shadow-error" : ""}`}
            >
              <label className={inputLabel}>Harjoitustyyppi</label>
              <div className={optionContainer}>
                {optionsData.workout_types.map((type) =>
                  renderRadioButton(
                    "workout_type",
                    type.id.toString(),
                    type.name,
                    workoutTypeChangeHandler
                  )
                )}
              </div>
            </div>
          )}

          {newJournalEntryData.entry_type === "1" &&
            newJournalEntryData.workout_type === "3" && (
              <div
                className={`${inputContainer} px-2.5 ${errors.workout_category ? "shadow-error" : ""}`}
              >
                <label className={inputLabel} htmlFor="workout-category">
                  Harjoituskategoria
                </label>
                <select
                  className={`text-md text-textPrimary rounded-md bg-bgPrimary w-full  border-2 p-2 ${errors.workout_category ? "border-red-500" : "border-borderPrimary"} text-center`}
                  id="workoutCategory"
                  name="workout_category"
                  value={newJournalEntryData.workout_category}
                  onChange={changeHandler}
                  disabled={newJournalEntryData.workout_type != "3"}
                >
                  {optionsData.workout_categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.id === 1
                        ? studentData.sport_name
                        : category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

          {newJournalEntryData.entry_type === "1" && (
            <div
              className={`${inputContainer} ${errors.intensity ? "shadow-error" : ""}`}
            >
              <label className={inputLabel}>Rankkuus</label>
              <div className={optionContainer}>
                {optionsData.workout_intensities.map((intensity) =>
                  renderRadioButton(
                    "intensity",
                    intensity.id.toString(),
                    intensity.name,
                    changeHandler
                  )
                )}
              </div>
            </div>
          )}

          {/* Additional Details */}
          <div className={inputContainer}>
            <label
              className={`${inputLabel} cursor-pointer flex items-center gap-1 hover:text-primaryColor hover:cursor-pointer`}
              htmlFor="details-textarea"
              onClick={() => setShowDetails((prevState) => !prevState)}
            >
              Lisätiedot{" "}
              {(showDetails && <FiChevronUp className="text-lg" />) || (
                <FiChevronDown className="text-lg" />
              )}
            </label>
            {showDetails && (
              <div className="relative w-full">
                <textarea
                  className="w-full h-18 border-borderPrimary bg-bgPrimary border-2 rounded-md p-2 pb-4 text-textPrimary ring-2 focus:outline-none ring-transparent focus:ring-2 focus:ring-primaryColor"
                  onChange={changeHandler}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.stopPropagation();
                    }
                  }}
                  type="text"
                  name="details"
                  id="details-textarea"
                  value={newJournalEntryData.details}
                  rows={2}
                  maxLength={200}
                  style={{ resize: "none", overflowY: "auto" }} // Prevent manual resizing and hide scrollbar initially
                  required
                ></textarea>
                <p
                  className={`absolute bottom-2 rounded right-2 text-sm text-opacity-${newJournalEntryData.details.length === 200 ? "100" : "40"} ${
                    newJournalEntryData.details.length === 200
                      ? "text-red-500 bg-bgPrimary z-10"
                      : "text-textPrimary"
                  }`}
                  style={{ pointerEvents: "none" }} // Make sure it doesn't interfere with textarea interactions
                >
                  {newJournalEntryData.details.length}/200
                </p>
              </div>
            )}
          </div>

          {/* Submit button */}
          <div className="flex flex-col items-center w-full gap-4 p-4 mt-auto text-center text-red-400">
            {conflict.messageShort && <p>{conflict.messageShort}</p>}
            <button
              className={`min-w-[160px] text-white px-4 py-4 rounded-md   active:scale-95 transition-all duration-150
    ${submitButtonIsDisabled ? "bg-bgPrimary cursor-not-allowed" : "border-borderPrimary cursor-pointer bg-primaryColor"}`}
              type="submit"
              disabled={submitButtonIsDisabled}
            >
              {submitButtonIsDisabled ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-borderPrimary animate-spin  fill-primaryColor mx-auto"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                getSubmitButtonText(newJournalEntryData.entry_type)
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewJournalEntryPage;
