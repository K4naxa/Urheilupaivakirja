import { useState, useEffect } from "react";
import trainingService from "../services/trainingService.js";

function JournalEntryForm({ initialData, onSubmit, mode }) {
  const [journalData, setJournalData] = useState(initialData);
  const [options, setOptions] = useState({
    journal_entry_types: [],
    workout_types: [],
    workout_categories: [],
    time_of_day: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const optionsData = await trainingService.getJournalEntryOptions();
        setOptions(optionsData);
      } catch (error) {
        console.error("Failed to fetch options:", error);
      }
    };

    fetchOptions();
  }, []);

  const ISO8601toYYYYMMDD = (isoDateString) => {
    const date = new Date(isoDateString);

    // Extract year, month, and day
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed, add 1
    const day = date.getDate().toString().padStart(2, "0");

    // Combine into desired format
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {

    if (initialData.entry_type != "") {
      let stringifiedData = {
        entry_id: initialData.entry_id.toString(),
        entry_type: initialData.entry_type.toString(),
        workout_type: initialData.workout_type.toString(),
        workout_category: initialData.workout_category.toString(),
        length_hours: initialData.length_hours.toString(),
        length_minutes: initialData.length_minutes.toString(),
        time_of_day: initialData.time_of_day.toString(),
        intensity: initialData.intensity.toString(),
        date: ISO8601toYYYYMMDD(initialData.date),
        details: initialData.details,
      };
      setJournalData(stringifiedData);
    } else {
      setJournalData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    console.log(options);
  }, [options]);

  useEffect(() => {
    console.log(journalData);
  }, [journalData]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setJournalData({
      ...journalData,
      [name]: value,
    });
  };

  const renderRadioButton = (name, value, label) => {
    return (
      <div key={`${name}-${value}`}>
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

  const errorCheckJournalEntry = () => {
    return true;
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    const isValid = errorCheckJournalEntry();
    if (!isValid) {
      return;
    }
    await onSubmit(journalData);
  };

  return (
    <form onSubmit={formSubmitHandler}>
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
      <div className="journal-entry-input-container">
        <label htmlFor="length-hours-picker">Kesto</label>
        <input
          type="number"
          name="length_hours"
          value={journalData.length_hours}
          onChange={changeHandler}
          placeholder="Tunnit"
          min="0"
          max="23"
          id="length-hours-picker"
        />
        {/*TODO: MIN JA MAX EIVÄT TOIMI KUNNOLLA!*/}
        <input
          type="number"
          name="length_minutes"
          value={journalData.length_minutes}
          onChange={changeHandler}
          placeholder="Minuutit"
          min="0"
          max="59"
          id="length-minutes-picker"
        />
      </div>
      <div className="journal-entry-input-container">
        <label>Merkintätyyppi</label>
        <div className="radio-option-horizontal-container">
          {options.journal_entry_types.map((entry) =>
            renderRadioButton("entry_type", entry.id.toString(), entry.name)
          )}
        </div>
      </div>
      <div className="journal-entry-input-container">
        <label>Harjoitustyyppi</label>
        <div className="radio-option-horizontal-container">
          {options.workout_types.map((type) =>
            renderRadioButton("workout_type", type.id.toString(), type.name)
          )}
        </div>
      </div>
      <div className="journal-entry-input-container">
        <label>Harjoituskategoria</label>
        <div className="radio-option-horizontal-container">
          {options.workout_categories.map((category) =>
            renderRadioButton(
              "workout_category",
              category.id.toString(),
              category.name
            )
          )}
        </div>
      </div>

      <div className="journal-entry-input-container">
        <label>Ajankohta</label>
        <div className="radio-option-horizontal-container">
          {options.time_of_day.map((time) =>
            renderRadioButton("time_of_day", time.id.toString(), time.name)
          )}
        </div>
      </div>
      <div className="journal-entry-input-container">
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
      <div className="journal-entry-input-container">
        <label htmlFor="details-textarea">Lisätiedot</label>
        <textarea
          onChange={changeHandler}
          type="text"
          name="details"
          id="details-textarea"
          placeholder=""
          value={journalData.details}
        />
      </div>
      <button className="journal-entry-submit-button" type="submit">
        {mode === "edit" ? "Päivitä merkintää" : "Lisää merkintä"}
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default JournalEntryForm;
