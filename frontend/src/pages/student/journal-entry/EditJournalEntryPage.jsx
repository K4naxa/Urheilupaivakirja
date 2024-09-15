import { useState, useEffect, useLayoutEffect, useMemo } from "react";
import journalService from "../../../services/journalService.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../hooks/toast-messages/useToast.jsx";
import { FiArrowLeft, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { useConfirmModal } from "../../../hooks/useConfirmModal.jsx";

const inputContainer =
  "flex flex-col items-center gap-0.5 sm:gap-1 w-full max-w-[370px] p-1";
const inputLabel = "text-textPrimary font-medium";
const optionContainer = "flex justify-between w-full p-2";

const EditJournalEntryPage = ({ onClose, studentData, entryId }) => {
  const { openConfirmModal } = useConfirmModal();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [journalEntryData, setJournalEntryData] = useState({
    entry_id: "",
    entry_type: "",
    workout_type: "",
    workout_category: "1",
    length_in_minutes: "60",
    time_of_day: "",
    intensity: "",
    date: "",
    details: "",
  });

  const { entry_id } = useParams();

  const EntryIdForQuery = entryId || entry_id;

  const [errors, setErrors] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [conflict, setConflict] = useState({
    value: false,
    message: "",
    messageShort: "",
  });
  const [submitButtonIsDisabled, setSubmitButtonIsDisabled] = useState(false);

  const {
    data: journalEntry,
    error: journalEntryError,
    isFetching: journalEntryisFetching,
  } = useQuery({
    queryKey: ["journalEntry"],
    queryFn: () => journalService.getJournalEntryForForm(EntryIdForQuery),
  });

  useEffect(() => {
    if (journalEntry) {
      if (journalEntry.details && journalEntry.details.trim() !== "") {
        setShowDetails(true);
      }
      setJournalEntryData(journalEntry);
    }
  }, [journalEntry]);

  const editJournalEntry = useMutation({
    mutationFn: () => journalService.editJournalEntry(journalEntryData),
    onError: (error) => {
      console.error("Error updating journal entry:", error);

      let errorMessage = "Virhe päivitettäessä merkintää.";

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage =
              "Virheellinen pyyntö. Tarkista syötetyt tiedot ja yritä uudelleen.";
            break;
          case 403:
            errorMessage = "Sinulla ei ole oikeuksia muokata tätä merkintää.";
            break;
          case 404:
            errorMessage = "Merkintää ei löytynyt.";
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
    // Invalidate and refetch the query after the mutation
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentData"] });

      addToast("Merkintä päivitetty", { style: "success" });

      onClose();
    },
  });

  const deleteEntry = useMutation({
    mutationFn: () =>
      journalService.deleteJournalEntry(journalEntryData.entry_id),
    onError: (error) => {
      console.error("Error deleting journal entry:", error);
      addToast("Virhe poistettaessa merkintää", { style: "error" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentData"] });
      addToast("Merkintä poistettu", { style: "success" });
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

  // get all journal entries for the selected date from cache
  const entriesForSelectedDate = useMemo(() => {
    const filteredEntries =
      studentData.journal_entries
        ?.map((entry) => ({
          ...entry,
          date: formatDateString(entry.date),
        }))
        .filter((entry) => entry.date === journalEntryData.date) || [];
    return filteredEntries;
  }, [studentData, journalEntryData.date]);

  // check for conflicts when the selected date or entry type changes
  useLayoutEffect(() => {
    if (entriesForSelectedDate.length > 0) {
      checkForConflicts(
        journalEntryData.entry_type,
        journalEntryData.date,
        entriesForSelectedDate
      );
    }
  }, [
    entriesForSelectedDate,
    journalEntryData.entry_type,
    journalEntryData.date,
  ]);

  const editJournalEntryHandler = async (e) => {
    e.preventDefault();
    setErrors("");
    if (!errorCheckJournalEntry()) {
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
      return; // Open modal for conflicts and wait for user decision
    }

    try {
      editJournalEntry.mutate({ journalEntryData });
    } catch (error) {
      console.error("Error adding journal entry:", error);
    }
  };

  const deleteJournalEntryHandler = async (e) => {
    e.preventDefault();

    const onConfirmDelete = async () => {
      try {
        deleteEntry.mutate({ journalEntryData });
      } catch (error) {
        console.error("Error deleting journal entry:", error);
      }
    };

    openConfirmModal({
      text: "Merkintä poistetaan pysyvästi",
      agreeButtonText: "Poista",
      agreeStyle: "red",
      declineButtonText: "Peruuta",
      onAgree: onConfirmDelete,
      closeOnOutsideClick: false,
    });
  };

  const handleUserConfirmation = async () => {
    try {
      await editJournalEntry.mutate({ journalEntryData });
    } catch (error) {
      console.error("Error after user confirmation:", error);
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setJournalEntryData((journalEntryData) => ({
      ...journalEntryData,
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
    const newType = journalEntryData.entry_type === type ? "1" : type;
    setJournalEntryData((prevState) => ({
      ...prevState,
      entry_type: newType,
    }));
  };

  // if workout_type is changed to 1 (akatemia) or 2 (seura), set workout_category to 1 (omalaji)
  const workoutTypeChangeHandler = (e) => {
    const { name, value } = e.target;
    setJournalEntryData((prevState) => {
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
    if (![1, 2, 3].includes(Number(journalEntryData.entry_type))) {
      setErrors((prevErrors) => ({ ...prevErrors, entry_type: true }));
      hasMissingInputs = true;
    }

    hasMissingInputs |= checkIfEmpty(journalEntryData.date, "date");
    hasMissingInputs |= validateDateFormat(journalEntryData.date, "date");

    if (journalEntryData.entry_type === "1") {
      hasMissingInputs |= checkIfEmpty(
        journalEntryData.workout_type,
        "workout_type"
      );
      hasMissingInputs |= checkIfEmpty(
        journalEntryData.workout_category,
        "workout_category"
      );
      hasMissingInputs |= checkIfEmpty(
        journalEntryData.length_in_minutes,
        "length_in_minutes"
      );
      hasMissingInputs |= checkIfEmpty(
        journalEntryData.time_of_day,
        "time_of_day"
      );
      hasMissingInputs |= checkIfEmpty(journalEntryData.intensity, "intensity");
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
            "Päivälle on merkitty yksi tai useampi harjoitus. Muutoksien tallentaminen merkitsee päivän lepopäiväksi ja poistaa päivälle tehdyt harjoitusmerkinnät.",
          messageShort: "Päivälle on merkitty yksi tai useampi harjoitus.",
        },
        3: {
          message:
            "Päivälle on merkitty yksi tai useampi harjoitus. Muutoksien tallentaminen merkitsee päivän sairauspäiväksi ja poistaa päivälle tehdyt harjoitusmerkinnät.",
          messageShort: "Päivälle on merkitty yksi tai useampi harjoitus.",
        },
      },
      2: {
        1: {
          message:
            "Päivä on merkitty lepopäiväksi. Muutoksien tallentaminen merkitsee päivän harjoituspäiväksi.",
          messageShort: "Päivä on merkitty lepopäiväksi.",
        },
        2: {
          message: "Päivä on jo merkitty lepopäiväksi.",
          messageShort: "Päivä on jo merkitty lepopäiväksi.",
        },
        3: {
          message:
            "Päivä on merkitty lepopäiväksi. Muutoksien tallentaminen merkitsee päivän sairauspäiväksi.",
          messageShort: "Päivä on merkitty lepopäiväksi.",
        },
      },
      3: {
        1: {
          message:
            "Päivä on merkitty sairauspäiväksi. Muutoksien tallentaminen merkitsee päivän harjoituspäiväksi.",
          messageShort: "Päivä on merkitty sairauspäiväksi.",
        },
        2: {
          message:
            "Päivä on merkitty sairauspäiväksi. Muutoksien tallentaminen merkitsee päivän lepopäiväksi.",
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
      <div className="relative w-24" key={`${name}-${value}`}>
        <input
          type="radio"
          name={name}
          value={value}
          checked={journalEntryData[name] === value}
          id={`${name}-${value}`}
          onChange={onChangeHandler}
          className="absolute opacity-0 w-0 h-0 peer"
          tabIndex="0" // Make sure it's focusable
        />
        <label
          htmlFor={`${name}-${value}`}
          className="peer-checked:border-primaryColor  peer-checked:text-bgSecondary peer-checked:bg-primaryColor bg-bgSecondary
          peer-focus-visible:ring-2 peer-focus-visible:ring-secondaryColor p-1 block rounded border border-borderPrimary text-textPrimary text-center cursor-pointer
          active:scale-95 transition-transform duration-75 hover:border-primaryColor hover:text-primaryColor"
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
        return "Tallenna muutokset";
      case "2":
        return "Merkitse lepopäiväksi";
      case "3":
        return "Merkitse sairauspäiväksi";
      default:
        return "Lähetä";
    }
  }

  if (optionsError) {
    console.error("Error:", error);
    return <p>Error: {error?.message || "Unknown error"}</p>;
  }

  if (optionsLoading || journalEntryisFetching) {
    return <p>Loading...</p>;
  }

  if (journalEntryError || optionsError) {
    console.error("Error fetching journal entry:", journalEntryError);
    return <p>Error: {journalEntryError.message || "Unknown error"}</p>;
  }

  return (
    <>
      <div className="flex flex-col h-full sm:rounded-md overflow-auto hide-scrollbar transition-transform duration-300 ">
        <div className="relative bg-primaryColor p-3 sm:p-4 text-center text-white text-xl shadow-md sm:rounded-t-md">
          <p className="sm:min-w-[400px] cursor-default	">Muokkaa merkintää</p>
          <button
            onClick={onClose}
            className="absolute bottom-1/2 translate-y-1/2 left-5 text-2xl hover:scale-125 transition-transform duration-150"
          >
            <FiArrowLeft />
          </button>
        </div>
        <form
          className="flex flex-col items-center gap-1 sm:gap-2 p-4 sm:px-8 bg-bgSecondary sm:rounded-b-md flex-grow"
          onSubmit={editJournalEntryHandler}
        >
          <div className="flex flex-col items-center w-full p-1">
            <div className="flex flex-row gap-12 justify-between">
              <button
                type="button"
                onClick={() => entryTypeChangeHandler("2")}
                className={`w-32 block rounded-xl text-textPrimary cursor-pointer active:scale-95 transition-transform duration-75
              border-2 ${journalEntryData.entry_type === "2" ? "border-bgRest bg-bgRest" : "border-bgRest bg-bgSecondary hover:bg-bgRest hover:bg-opacity-40"}
              `}
              >
                Lepopäivä
              </button>

              <button
                type="button"
                onClick={() => entryTypeChangeHandler("3")}
                className={`w-32 block rounded-xl text-textPrimary cursor-pointer active:scale-95 transition-transform duration-75
              border-2 ${journalEntryData.entry_type === "3" ? "border-bgSick bg-bgSick" : "border-bgSick bg-bgSecondary hover:bg-bgSick hover:bg-opacity-40"}
              `}
              >
                Sairauspäivä
              </button>
            </div>
          </div>

          <div className={`${inputContainer} px-2.5`}>
            <label className={inputLabel} htmlFor="date-picker">
              Päivämäärä
            </label>
            <input
              className={`text-textPrimary border-borderPrimary h-9 w-full bg-bgSecondary focus-visible:outline-none border-b p-1 ${errors.date ? "border-red-500" : "border-borderPrimary"} text-center`}
              type="date"
              name="date"
              value={journalEntryData.date}
              onChange={changeHandler}
              id="date-picker"
            />
          </div>

          {journalEntryData.entry_type === "1" && (
            <div
              className={`${inputContainer} ${errors.length_in_minutes ? "shadow-error" : ""}`}
            >
              <label className={inputLabel} htmlFor="length_in_minutes">
                Kesto: {convertTime(journalEntryData.length_in_minutes)}
              </label>
              <div className="w-full p-1">
                <input
                  className="bg-bgPrimary w-full"
                  type="range"
                  min="30"
                  max="195"
                  value={journalEntryData.length_in_minutes}
                  step="15"
                  id="length_in_minutes"
                  onChange={changeHandler}
                  name="length_in_minutes"
                />
              </div>
            </div>
          )}
          {journalEntryData.entry_type === "1" && (
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

          {journalEntryData.entry_type === "1" && (
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

          {journalEntryData.entry_type === "1" &&
            journalEntryData.workout_type === "3" && (
              <div
                className={`${inputContainer} px-2.5 ${errors.workout_category ? "shadow-error" : ""}`}
              >
                <label className={inputLabel} htmlFor="workout-category">
                  Harjoituskategoria
                </label>
                <select
                  className={`text-md text-textPrimary bg-bgSecondary h-9 w-full  border-b p-1 ${errors.workout_category ? "border-red-500" : "border-borderPrimary"} text-center`}
                  id="workoutCategory"
                  name="workout_category"
                  value={journalEntryData.workout_category}
                  onChange={changeHandler}
                  disabled={journalEntryData.workout_type != "3"}
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

          {journalEntryData.entry_type === "1" && (
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
                  className="w-full h-18 border-borderPrimary bg-bgPrimary border rounded-md p-1 text-textPrimary"
                  onChange={changeHandler}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.stopPropagation();
                    }
                  }}
                  type="text"
                  name="details"
                  id="details-textarea"
                  value={journalEntryData.details}
                  rows={2}
                  maxLength={200}
                  style={{ resize: "none", overflowY: "hidden" }} // Prevent manual resizing and hide scrollbar initially
                  required
                ></textarea>
                <p
                  className={`absolute bottom-1 rounded right-2 text-sm text-opacity-${journalEntryData.details.length === 200 ? "100" : "40"} ${
                    journalEntryData.details.length === 200
                      ? "text-red-500 bg-bgPrimary z-10"
                      : "text-textPrimary"
                  }`}
                  style={{ pointerEvents: "none" }} // Make sure it doesn't interfere with textarea interactions
                >
                  {journalEntryData.details.length}/200
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col text-red-400 text-center items-center gap-4 w-full p-4 mt-auto">
            {conflict.messageShort && <p>{conflict.messageShort}</p>}
            <div className="flex w-full">
              <div className="flex-1"></div>
              <div>
                <button
                  className={`min-w-[160px] text-white mx-6 px-4 py-4 rounded-md bg-primaryColor border-borderPrimary active:scale-95 transition-transform duration-75 hover:bg-hoverPrimary
      ${submitButtonIsDisabled ? "bg-gray-400 opacity-20 text-gray border-gray-300 cursor-not-allowed" : "cursor-pointer"}`}
                  type="submit"
                  disabled={submitButtonIsDisabled}
                >
                  {getSubmitButtonText(journalEntryData.entry_type)}
                </button>
              </div>
              <div className="flex-1 flex justify-center">
                <button
                  className="hover:cursor-pointer hover:bg-bgGray rounded m-1.5 p-2"
                  onClick={deleteJournalEntryHandler}
                >
                  <FiTrash2 className="text-2xl" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditJournalEntryPage;
