import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import trainingService from "../../../../services/trainingService.js";

const NewJournalEntryPage = () => {
  //TODO: new date = today (from other branch)
  const [journalData, setJournalData] = useState({
    entry_id: "",
    entry_type: "",
    workout_type: "",
    workout_category: "",
    length_in_minutes: "",
    time_of_day: "",
    intensity: "",
    date: "",
    details: "",
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [conflict, setConflict] = useState({ value: false, message: "" });
  const [submitButtonIsDisabled, setSubmitButtonIsDisabled] = useState(false);
  const [existingEntries, setExistingEntries] = useState([]);

  const { entry_id } = useParams();

  useEffect(() => {
    const fetchJournalEntry = async () => {
      try {
        const journalEntry = await trainingService.getJournalEntry(entry_id);
        const stringifiedData = {
          entry_id: journalEntry.entry_id
            ? journalEntry.entry_id.toString()
            : "",
          entry_type: journalEntry.entry_type
            ? journalEntry.entry_type.toString()
            : "",
          workout_type: journalEntry.workout_type
            ? journalEntry.workout_type.toString()
            : "",
          workout_category: journalEntry.workout_category
            ? journalEntry.workout_category.toString()
            : "",
          length_in_minutes: journalEntry.length_in_minutes
            ? journalEntry.length_in_minutes.toString()
            : "",
          time_of_day: journalEntry.time_of_day
            ? journalEntry.time_of_day.toString()
            : "",
          intensity: journalEntry.intensity
            ? journalEntry.intensity.toString()
            : "",
          date: journalEntry.date ? formatDateString(journalEntry.date) : "",
          details: journalEntry.details || "",
        };

        // if entry has details, show details
        if (journalEntry.details && journalEntry.details.trim() !== "") {
          setShowDetails(true);
        }

        setJournalData(stringifiedData);
      } catch (error) {
        console.error("Failed to fetch journal entry:", error);
      }
    };
    fetchJournalEntry();
  }, []);

  const [options, setOptions] = useState({
    journal_entry_types: [],
    workout_types: [],
    workout_categories: [],
    time_of_day: [],
  });

  // get options for entry_types, workout types, workout categories and time of day
  useEffect(() => {
    const fetchData = async () => {
      try {
        const optionsData = await trainingService.getJournalEntryOptions();
        setOptions(optionsData);
        console.log("Fetched options data:", optionsData);
      } catch (error) {
        console.error("Failed to fetch options:", error);
      }
    };

    fetchData();
  }, []);

  // fetch existing entries by date when date is changed (and update existingEntries)
  useEffect(() => {
    const fetchExistingEntries = async () => {
      if (!journalData.date) {
        return;
      }
      try {
        let newExistingEntries =
          await trainingService.getUserJournalEntriesByDate(journalData.date);
        const formattedExistingEntries = newExistingEntries.map((entry) => ({
          ...entry,
          date: formatDateString(entry.date),
        }));
        setExistingEntries(formattedExistingEntries);
      } catch (error) {
        console.error("Failed to fetch existing entries:", error);
      }
    };
    fetchExistingEntries();
  }, [journalData.date]);

  useEffect(() => {
    console.log("Existing Entries Updated:", existingEntries);
  }, [existingEntries]);

  useEffect(() => {
    console.log(journalData);
  }, [journalData]);

  useEffect(() => {
    console.log("Errors:", errors);
  }, [errors]);

  // check for conflicts when entry type is changed or existing entries are updated (i.e. when date is changed)
  useEffect(() => {
    setErrors({});
    setErrorMessage("");
    setSubmitButtonIsDisabled(false);
    setConflict({ value: false, message: "" });
    checkForConflicts(
      journalData.entry_id,
      journalData.entry_type,
      journalData.date,
      existingEntries
    );
  }, [existingEntries, journalData.entry_type]);

  // clear error message when errors are fixed
  useEffect(() => {
    if (Object.keys(errors).length === 0) {
      setErrorMessage("");
    }
  }, [errors]);

  // if workout_type is changed to 1 (akatemia) or 2 (seura), set workout_category to 1 (omalaji)
  useEffect(() => {
    if (journalData.workout_type === "1" || journalData.workout_type === "2") {
      setJournalData((prevState) => ({
        ...prevState,
        workout_category: "1", // 1 = oma laji
      }));
    }
  }, [journalData.workout_type]);

  const navigate = useNavigate();

  function formatDateString(isoDateString) {
    const date = new Date(isoDateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setJournalData((journalData) => ({
      ...journalData,
      [name]: value,
    }));

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
    if (![1, 2, 3].includes(Number(journalData.entry_type))) {
      setErrors((prevErrors) => ({ ...prevErrors, entry_type: true }));
      hasMissingInputs = true;
    }

    hasMissingInputs |= checkIfEmpty(journalData.date, "date"); // Using bitwise OR to update hasMissingInputs

    if (journalData.entry_type === "1") {
      hasMissingInputs |= checkIfEmpty(
        journalData.workout_type,
        "workout_type"
      );
      hasMissingInputs |= checkIfEmpty(
        journalData.workout_category,
        "workout_category"
      );
      hasMissingInputs |= checkIfEmpty(
        journalData.length_in_minutes,
        "length_in_minutes"
      );
      hasMissingInputs |= checkIfEmpty(journalData.time_of_day, "time_of_day");
      hasMissingInputs |= checkIfEmpty(journalData.intensity, "intensity");
    }

    if (hasMissingInputs) {
      setErrorMessage("Täytä kaikki kentät.");
      return false;
    }

    return true;
  };

  // check for conflicts between new and existing entries
  const checkForConflicts = (
    entry_id,
    entry_type,
    inputDate,
    existingEntries
  ) => {
    console.log(
      "Checking for conflicts with:",
      entry_type,
      inputDate,
      existingEntries
    );
    // Check if there are any existing entries on the same date,
    // ignoring the entry being edited so no message is shown if its the only entry for the date
    const conflictEntry = existingEntries.find(
      (entry) => entry.date === inputDate && entry.id != entry_id
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

    const conflictMessages = {
      1: {
        // Existing exercise entries
        // 1: this option does not exist as 1:1 conflict is handled above
        2: "Päivälle on merkitty yksi tai useampi harjoitus. Muutoksien tallentaminen merkitsee päivän lepopäiväksi ja poistaa päivälle tehdyt harjoitusmerkinnät.", //new entry is rest day
        3: "Päivälle on merkitty yksi tai useampi harjoitus. Muutoksien tallentaminen merkitsee päivän sairauspäiväksi ja poistaa päivälle tehdyt harjoitusmerkinnät.", //new entry is sick day
      },
      2: {
        // Existing rest day entry
        1: "Päivä on merkitty lepopäiväksi. Muutoksien tallentaminen merkitsee päivän harjoituspäiväksi.", //new entry is workout
        2: "Päivä on jo merkitty lepopäiväksi.", //new entry is rest day
        3: "Päivä on merkitty lepopäiväksi. Muutoksien tallentaminen merkitsee päivän sairauspäiväksi.", //new entry is sick day
      },
      3: {
        // Existing sick day entry
        1: "Päivä on merkitty sairauspäiväksi. Muutoksien tallentaminen merkitsee päivän harjoituspäiväksi.", //new entry is workout
        2: "Päivä on merkitty sairauspäiväksi. Muutoksien tallentaminen merkitsee päivän lepopäiväksi.", //new entry is rest day
        3: "Päivä on jo merkitty sairauspäiväksi.", //new entry is sick day
      },
    };

    // Check if the existing entry type is relevant to check against the new entry type
    if (
      conflictMessages[conflictEntry.entry_type_id] &&
      conflictMessages[conflictEntry.entry_type_id][entry_type]
    ) {
      setConflict({
        value: true,
        message: conflictMessages[conflictEntry.entry_type_id][entry_type],
      });
      console.log(
        "Conflict detected:",
        conflictMessages[conflictEntry.entry_type_id][entry_type]
      );
      return true;
    }
    setConflict({ value: false, message: "" });
    return false; // No relevant conflict detected
  };

  const newJournalEntryHandler = async (e) => {
    e.preventDefault();
    setErrors("");
    if (!errorCheckJournalEntry()) {
      return;
    }
    // if entry type is workout
    if (journalData.entry_type === "1") {
      try {
        await trainingService.editJournalEntry({
          entry_id: journalData.entry_id,
          entry_type: journalData.entry_type,
          workout_type: journalData.workout_type,
          workout_category: journalData.workout_category,
          time_of_day: journalData.time_of_day,
          length_in_minutes: journalData.length_in_minutes,
          intensity: journalData.intensity,
          details: journalData.details,
          date: journalData.date,
        });
      } catch (error) {
        console.error("Error creating a new journal entry:", error);
      }
    }
    // if entry type is sick day or rest day
    else if (journalData.entry_type === "2" || journalData.entry_type === "3") {
      try {
        await trainingService.editJournalEntry({
          entry_id: journalData.entry_id,
          entry_type: journalData.entry_type,
          workout_type: null,
          workout_category: null,
          time_of_day: null,
          length_in_minutes: null,
          intensity: null,
          details: journalData.details,
          date: journalData.date,
        });
      } catch (error) {
        console.error("Error creating a new journal entry:", error);
      }
    }
    navigate("/");
  };

  const deleteEntryHandler = async () => {
    try {
      await trainingService.deleteJournalEntry(journalData.entry_id);
    } catch (error) {
      console.error("Error deleting journal entry:", error);
    }
    navigate("/");
  };

  const renderRadioButton = (name, value, label) => {
    return (
      <div className="journal-entry-radio-button" key={`${name}-${value}`}>
        <input
          type="radio"
          name={`${name}`}
          value={value}
          checked={journalData[name] === value}
          id={`${name}-${value}`}
          onChange={changeHandler}
        />
        <label htmlFor={`${name}-${value}`}>{label}</label>
      </div>
    );
  };

  const convertTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) {
      return `${minutes}min`;
    }
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}min`;
  };

  /*
  function getSubmitButtonText(entry_type) {
    switch (entry_type) {
      case "1":
        return "Lisää harjoitus";
      case "2":
        return "Merkitse lepopäiväksi";
      case "3":
        return "Merkitse sairauspäiväksi";
      default:
        return "Submit"; // Default case to handle unexpected values
    }
  }
  */

  return (
    <>
      <div className="container">
        {
          // TODO: POISTA TEKSTI
        }
        <div className="journal-entry-container">
          <div className="journal-entry-header-container">
            Muokkaa merkintää
          </div>
          <form
            className="journal-entry-form"
            onSubmit={newJournalEntryHandler}
          >
            <div className="journal-entry-input-container">
              <label>Merkintätyyppi</label>
              <div className="radio-option-horizontal-container">
                {options.journal_entry_types.map((entry) =>
                  renderRadioButton(
                    "entry_type",
                    entry.id.toString(),
                    entry.name
                  )
                )}
              </div>
            </div>

            <div className="journal-entry-input-container">
              <label htmlFor="date-picker">Päivämäärä</label>
              <input
                type="date"
                name="date"
                value={journalData.date}
                onChange={changeHandler}
                id="date-picker"
              />
            </div>

            {journalData.entry_type === "1" && (
              <div
                className={`journal-entry-input-container ${
                  errors.length_in_minutes ? "missing-input" : ""
                }`}
              >
                <label htmlFor="length_in_minutes">
                  Kesto: {convertTime(journalData.length_in_minutes)}
                </label>
                <input
                  type="range"
                  min="30"
                  max="180"
                  value={journalData.length_in_minutes}
                  step="30"
                  id="length_in_minutes"
                  onChange={changeHandler}
                  name="length_in_minutes"
                />
              </div>
            )}

            {journalData.entry_type === "1" && (
              <div
                className={`journal-entry-input-container ${
                  errors.workout_type ? "missing-input" : ""
                }`}
              >
                <label>Harjoitustyyppi</label>
                <div className="radio-option-horizontal-container">
                  {options.workout_types.map((type) =>
                    renderRadioButton(
                      "workout_type",
                      type.id.toString(),
                      type.name
                    )
                  )}
                </div>
              </div>
            )}

            {journalData.entry_type === "1" && (
              <div
                className={`journal-entry-input-container ${
                  errors.workout_category ? "missing-input" : ""
                }`}
              >
                <label htmlFor="workout-category">Harjoituskategoria</label>
                <select
                  id="workoutCategory"
                  name="workout_category"
                  value={journalData.workout_category}
                  onChange={changeHandler}
                  disabled={journalData.workout_type != "3"}
                >
                  {options.workout_categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {journalData.entry_type === "1" && (
              <div
                className={`journal-entry-input-container ${
                  errors.time_of_day ? "missing-input" : ""
                }`}
              >
                <label>Ajankohta</label>
                <div className="radio-option-horizontal-container">
                  {options.time_of_day.map((time) =>
                    renderRadioButton(
                      "time_of_day",
                      time.id.toString(),
                      time.name
                    )
                  )}
                </div>
              </div>
            )}

            {journalData.entry_type === "1" && (
              <div
                className={`journal-entry-input-container ${
                  errors.intensity ? "missing-input" : ""
                }`}
              >
                <label>Rankkuus</label>
                <div className="radio-option-horizontal-container">
                  {[1, 2, 3].map((intensity) =>
                    renderRadioButton(
                      "intensity",
                      intensity.toString(),
                      intensity.toString()
                    )
                  )}
                </div>
              </div>
            )}

            <div className="journal-entry-input-container">
              <label
                htmlFor="details-textarea"
                onClick={() => setShowDetails((prevState) => !prevState)}
              >
                Lisätiedot V
              </label>
              {showDetails && (
                <textarea
                  onChange={changeHandler}
                  type="text"
                  name="details"
                  id="details-textarea"
                  value={journalData.details}
                />
              )}
            </div>
            <div>{errorMessage && <p>{errorMessage}</p>}</div>
            <div>{conflict.value && <p>{conflict.message}</p>}</div>
            <div className="journal-entry-button-container">
              <button
                className="submit-button"
                type="submit"
                disabled={submitButtonIsDisabled}
              >
                {/*getSubmitButtonText(journalData.entry_type) */}
                Tallenna muutokset
              </button>
              <button
                className="journal-entry-delete-button"
                onClick={deleteEntryHandler}
                type="button"
              >
                P
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewJournalEntryPage;
