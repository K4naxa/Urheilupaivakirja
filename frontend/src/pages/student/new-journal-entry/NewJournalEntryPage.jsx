import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./newJournalEntryPage.css";
import trainingService from "../../../services/trainingService.js";

const NewJournalEntryPage = () => {
  const [journalData, setJournalData] = useState({
    entry_type: "",
    workout_type: "",
    workout_category: "",
    length_hours: "",
    length_minutes: "",
    time_of_day: "",
    intensity: null,
    date: "",
    details: "",
  });
  const [options, setOptions] = useState({
    journal_entry_types: [],
    workout_types: [],
    workout_categories: [],
    time_of_day: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const optionsData = await trainingService.getJournalEntryOptions();
        setOptions(optionsData);
        console.log(optionsData);
      } catch (error) {
        console.error("Failed to fetch options:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(journalData);
  }, [journalData]);

  const navigate = useNavigate();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setJournalData({
      ...journalData,
      [name]: value,
    });
  };

  const errorCheckJournalEntry = () => {
    /*if (
      journalData.entry_type === "" ||
      journalData.workout_type === "" ||
      journalData.length_hours === "" ||
      journalData.length_minutes === "" ||
      journalData.time_of_day === "" ||
      journalData.intensity === "" ||
      journalData.details === null ||
      journalData.groupId === null ||
      journalData.date === null ||
      journalData.campusId === null
    ) {
      setError("Täytä kaikki kentät");
      return false;
    }
    */
    return true;
  };

  const newJournalEntryHandler = async (e) => {
    e.preventDefault();
    setError("");
    if (!errorCheckJournalEntry()) {
      return;
    }
    try {
      await trainingService.postJournalEntry(
        journalData.entry_type,
        journalData.workout_type,
        journalData.workout_category,
        journalData.time_of_day,
        journalData.length_hours,
        journalData.length_minutes,
        journalData.intensity,
        journalData.details,
        journalData.date
      );
      navigate("/");
    } catch (error) {
      console.error("Error creating a new journal entry:", error);
    }
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

  return (
    <>
      <div className="container">
        <div className="newJournalEntryContainer">
          <div className="newJournalEntryheader-container">Uusi harjoitus</div>
          <form
            className="newJournalEntryForm"
            onSubmit={newJournalEntryHandler}
          >
            <div className="newJournalEntryinput-container">
              <label htmlFor="date-picker">Päivämäärä</label>
              <input
                type="date"
                name="date"
                value={journalData.date}
                onChange={changeHandler}
                id="date-picker"
              />
            </div>
            <div className="newJournalEntryinput-container">
              <label htmlFor="length-hours-picker">Kesto</label>
              <input
                type="number"
                name="length_hours"
                value={journalData.length_hours}
                onChange={changeHandler}
                placeholder="Tunnit"
                min = "0"
                max = "23"
                id = "length-hours-picker"
              />
              {/*TODO: MIN JA MAX EIVÄT TOIMI KUNNOLLA!*/}
              <input
                type="number"
                name="length_minutes"
                value={journalData.length_minutes}
                onChange={changeHandler}
                placeholder="Minuutit"
                min= "0"
                max = "59"
                id = "length-minutes-picker"
              />
            </div>
            <div className="newJournalEntryinput-container">
              <label>Merkintätyyppi</label>
              <div className="radioOptionHorizontalContainer">
                {options.journal_entry_types.map((entry) =>
                  renderRadioButton(
                    "entry_type",
                    entry.id.toString(),
                    entry.name
                  )
                )}
              </div>
            </div>
            <div className="newJournalEntryinput-container">
              <label>Harjoitustyyppi</label>
              <div className="radioOptionHorizontalContainer">
                {options.workout_types.map((type) =>
                  renderRadioButton(
                    "workout_type",
                    type.id.toString(),
                    type.name
                  )
                )}
              </div>
            </div>
            <div className="newJournalEntryinput-container">
              <label>Harjoituskategoria</label>
              <div className="radioOptionHorizontalContainer">
                {options.workout_categories.map((category) =>
                  renderRadioButton(
                    "workout_category",
                    category.id.toString(),
                    category.name
                  )
                )}
              </div>
            </div>

            <div className="newJournalEntryinput-container">
              <label>Ajankohta</label>
              <div className="radioOptionHorizontalContainer">
                {options.time_of_day.map((time) =>
                  renderRadioButton(
                    "time_of_day",
                    time.id.toString(),
                    time.name
                  )
                )}
              </div>
            </div>
            <div className="newJournalEntryinput-container">
              <label>Rankkuus</label>
              <div className="radioOptionHorizontalContainer">
                {[1, 2, 3, 4, 5].map((intensity) =>
                  renderRadioButton(
                    "intensity",
                    intensity.toString(),
                    intensity.toString()
                  )
                )}
              </div>
            </div>
            <div className="newJournalEntryinput-container">
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
            <button className="button" type="submit">
              Lisää harjoitus
            </button>
          </form>
        </div>
        <div>{error && <p>{error}</p>}</div>
      </div>
    </>
  );
};

export default NewJournalEntryPage;
