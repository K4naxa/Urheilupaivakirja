import { useState, useLayoutEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import trainingService from "../../../services/trainingService.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfirmModal } from "../../../components/confirm-modal/confirmModal.jsx";
import { useToast } from "../../../hooks/toast-messages/useToast.jsx";
import { FiArrowLeft } from "react-icons/fi";

//const headerContainer = "bg-headerPrimary border-borderPrimary border-b p-5 text-center text-xl shadow-md sm:rounded-t-md";
const inputContainer = "flex flex-col items-center gap-1 w-full";
const inputLabel = "text-lg text-textPrimary";
const optionContainer = "flex flex-row justify-between";

const NewJournalEntryPage = ({ onClose, date }) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const initialDate = date || dayjs(new Date()).format("YYYY-MM-DD");
  console.log(date)
  console.log("Initial date:", initialDate);

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

  console.log("Rendering");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [conflict, setConflict] = useState({
    value: false,
    message: "",
    messageShort: "",
  });
  const [submitButtonIsDisabled, setSubmitButtonIsDisabled] = useState(false);

  const addJournalEntry = useMutation({
    mutationFn: () => trainingService.postJournalEntry(newJournalEntryData),
    // If the mutation fails, roll back to the previous value
    onError: (error) => {
      console.error("Error adding journal entry:", error);
      addToast("Virhe lisättäessä merkintää", { style: "error" });
    },
    // Invalidate and refetch the query after the mutation
    onSuccess: () => {
      queryClient.invalidateQueries(["studentJournal"]);
      // Navigate to the next page after the mutation succeeds
      addToast("Merkintä lisätty", { style: "success" });
      onClose();
    },
  });

  // Journal data for matching
  const {
    data: journalEntriesData,
    isLoading: journalEntriesDataLoading,
    isError: journalEntriesDataError,
  } = useQuery({
    queryKey: ["studentJournal"],
    queryFn: () => trainingService.getAllUserJournalEntries(),
    staleTime: 15 * 60 * 1000, // Same staleTime to manage freshness similarly
  });

  // Options data for dropdowns
  const {
    data: optionsData,
    isLoading: optionsLoading,
    isError: optionsError,
    error,
  } = useQuery({
    queryKey: ["options"],
    queryFn: () => trainingService.getJournalEntryOptions(),
  });

  // get all journal entries for the selected date from cache
  const entriesForSelectedDate = useMemo(() => {
    const filteredEntries =
      journalEntriesData
        ?.map((entry) => ({
          ...entry,
          date: formatDateString(entry.date),
        }))
        .filter((entry) => entry.date === newJournalEntryData.date) || [];
    return filteredEntries;
  }, [journalEntriesData, newJournalEntryData.date]);

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
    setErrors("");
    if (!errorCheckJournalEntry()) {
      return;
    }

    if (conflict.value) {
      setShowConfirmModal(true);
      return; // Open modal for conflicts and wait for user decision
    }

    try {
      await addJournalEntry.mutate({ newJournalEntryData });
    } catch (error) {
      console.error("Error adding journal entry:", error);
    }
  };

  const handleUserConfirmation = async () => {
    setShowConfirmModal(false); // Close the modal
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

  const entryTypeChangeHandler = (e) => {
    const { value } = e.target;

    setNewJournalEntryData((prevState) => ({
      ...prevState,
      entry_type: value,
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

    // if entry type is not 1, 2 or 3
    if (![1, 2, 3].includes(Number(newJournalEntryData.entry_type))) {
      setErrors((prevErrors) => ({ ...prevErrors, entry_type: true }));
      hasMissingInputs = true;
    }

    hasMissingInputs |= checkIfEmpty(newJournalEntryData.date, "date"); // Using bitwise OR to update hasMissingInputs

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
    console.log(
      "Checking for conflicts with:",
      entry_type,
      inputDate,
      existingEntries
    );

    setSubmitButtonIsDisabled(false);
    setConflict({ value: false, message: "", messageShort: "" });
    // Check if there are any existing entries on the same date
    const conflictEntry = existingEntries.find(
      (entry) => entry.date === inputDate
    );

    if (!conflictEntry) {
      console.log("No conflict detected, using:", existingEntries);
      return false; // No conflict if no entries exist on this date
    }

    if (conflictEntry.entry_type_id == 1 && entry_type == 1) {
      setSubmitButtonIsDisabled(false);
      console.log(
        "No conflicts as both entry types are 1, using:",
        existingEntries
      );
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
      console.log("Conflict detected:", conflictData.message);
    }
  };

  const renderRadioButton = (name, value, label, onChangeHandler) => {
    return (
      <div className="relative mr-1 ml-1 w-[110px]" key={`${name}-${value}`}>
        <input
          type="radio"
          name={name}
          value={value}
          checked={newJournalEntryData[name] === value}
          id={`${name}-${value}`}
          onChange={onChangeHandler}
          className="absolute opacity-0 w-0 h-0 peer"
          tabIndex="0" // Make sure it's focusable
        />
        <label
          htmlFor={`${name}-${value}`}
          className="peer-checked:bg-headerPrimary peer-focus:ring-2 peer-focus:ring-headerSecondary py-1 block rounded border-2 border-gray-400 text-textPrimary text-md text-center cursor-pointer"
        >
          {label}
        </label>
      </div>
    );
  };

  function convertTime(totalMinutes) {
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

  if (optionsLoading || journalEntriesDataLoading) {
    console.log("is loading");
    return <p>Loading...</p>;
  }

  if (optionsError || journalEntriesDataError) {
    console.log("is erroring");
    console.error("Error:", error);
    return <p>Error: {error?.message || "Unknown error"}</p>;
  }

  function formatDateString(isoDateString) {
    // Assuming the input date string is in UTC and in ISO format
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
      <ConfirmModal
        isOpen={showConfirmModal}
        onDecline={() => setShowConfirmModal(false)}
        onAgree={handleUserConfirmation}
        text={conflict.message}
        agreeButton="Jatka"
        declineButton="Peruuta"
        closeOnOutsideClick={false}
      />
      <div className="flex flex-col h-full sm:border-2 sm:border-borderPrimary sm:rounded-lg overflow-auto hide-scrollbar">
        <div className="relative bg-headerPrimary border-borderPrimary border-b p-3 sm:p-5 text-center text-xl shadow-md sm:rounded-t-md">
          <p>Uusi merkintä</p>
          <button
            onClick={onClose}
            className="absolute bottom-1/2 translate-y-1/2 left-5 text-3xl"
          >
            <FiArrowLeft />
          </button>
        </div>
        <form
          className="flex flex-col items-center gap-4 p-2 sm:p-8 bg-bgkSecondary rounded-md flex-grow"
          onSubmit={newJournalEntryHandler}
        >
          <div className={inputContainer}>
            <div className={optionContainer}>
              {optionsData.journal_entry_types.map((entry) =>
                renderRadioButton(
                  "entry_type",
                  entry.id.toString(),
                  entry.name,
                  entryTypeChangeHandler
                )
              )}
            </div>
          </div>

          <div className={inputContainer}>
            <label className={inputLabel} htmlFor="date-picker">
              Päivämäärä
            </label>
            <input
              className=" text-lg  text-textPrimary border-borderPrimary bg-bgkSecondary h-10 w-full focus-visible:outline-none  border-b p-1 "
              type="date"
              name="date"
              value={newJournalEntryData.date}
              onChange={changeHandler}
              id="date-picker"
            />
          </div>

          {newJournalEntryData.entry_type === "1" && (
            <div
              className={`${inputContainer} ${
                errors.length_in_minutes ? "border-l-4 border-red-500" : ""
              }`}
            >
              <label className={inputLabel} htmlFor="length_in_minutes">
                Kesto: {convertTime(newJournalEntryData.length_in_minutes)}
              </label>
              <input
                className=" border-borderPrimary bg-bgkSecondary h-10 w-full p-1 "
                type="range"
                min="30"
                max="180"
                value={newJournalEntryData.length_in_minutes}
                step="30"
                id="length_in_minutes"
                onChange={changeHandler}
                name="length_in_minutes"
              />
            </div>
          )}

          {newJournalEntryData.entry_type === "1" && (
            <div
              className={`${inputContainer} ${
                errors.workout_type ? "border-l-4 border-red-500" : ""
              }`}
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
                className={`${inputContainer} ${
                  errors.workout_category ? "border-l-4 border-red-500" : ""
                }`}
              >
                <label className={inputLabel} htmlFor="workout-category">
                  Harjoituskategoria
                </label>
                <select
                  className="text-lg  text-textPrimary border-borderPrimary bg-bgkSecondary h-10 w-full  border-b p-1"
                  id="workoutCategory"
                  name="workout_category"
                  value={newJournalEntryData.workout_category}
                  onChange={changeHandler}
                  disabled={newJournalEntryData.workout_type != "3"}
                >
                  {optionsData.workout_categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

          {newJournalEntryData.entry_type === "1" && (
            <div
              className={`${inputContainer} ${
                errors.time_of_day ? "border-l-4 border-red-500" : ""
              }`}
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
              className={`${inputContainer} ${
                errors.intensity ? "border-l-4 border-red-500" : ""
              }`}
            >
              <label className={inputLabel}>Rankkuus</label>
              <div className={optionContainer}>
                {[1, 2, 3].map((intensity) =>
                  renderRadioButton(
                    "intensity",
                    intensity.toString(),
                    intensity.toString(),
                    changeHandler
                  )
                )}
              </div>
            </div>
          )}

          <div className={inputContainer}>
            <label
              className={inputLabel}
              htmlFor="details-textarea"
              onClick={() => setShowDetails((prevState) => !prevState)}
            >
              Lisätiedot V
            </label>
            {showDetails && (
              <textarea
                className="w-full h-18 border-borderPrimary border rounded-lg p-1 text-textPrimary"
                onChange={changeHandler}
                onKeyDown={(event) => {
                  console.log(event.key);
                  if (event.key === "Enter") {
                    event.stopPropagation();
                  }
                }}
                type="text"
                name="details"
                id="details-textarea"
                value={newJournalEntryData.details}
              />
            )}
          </div>

          <div className="flex flex-col items-center gap-4 w-full p-4 mt-auto">
            {conflict.messageShort && <p>{conflict.messageShort}</p>}
            <button
              className={`text-textPrimary w-44 h-14 rounded-lg bg-headerPrimary border-borderPrimary
    ${submitButtonIsDisabled ? "bg-gray-400 opacity-20 text-gray border-gray-300 cursor-not-allowed" : "cursor-pointer"}`}
              type="submit"
              disabled={submitButtonIsDisabled}
            >
              {getSubmitButtonText(newJournalEntryData.entry_type)}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewJournalEntryPage;
