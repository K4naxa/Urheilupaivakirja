import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./newJournalEntryPage.css";
import trainingService from "../../../../services/trainingService.js";
import JournalEntryForm from "../../../../components/JournalEntryForm";

const NewJournalEntryPage = () => {
  const journalData = {
    entry_type: "",
    workout_type: "",
    workout_category: "",
    length_hours: "",
    length_minutes: "",
    time_of_day: "",
    intensity: null,
    date: "",
    details: "",
  };

  const navigate = useNavigate();

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

  /*const newJournalEntryHandler = async (e) => {
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
  };*/

  const handleCreate = async (journalData) => {
    try {
      await trainingService.postJournalEntry(journalData);
      navigate("/");
    } catch (error) {
      console.error("Error creating a new journal entry:", error);
    }
  };

  return (
    <>
      <div className="container">
        <div className="journal-entry-container">
          <div className="journal-entry-header-container">Uusi harjoitus</div>
          <JournalEntryForm
            initialData={journalData}
            onSubmit={handleCreate}
            mode="Lisää merkintä"
          />
        </div>
      </div>
    </>
  );
};

export default NewJournalEntryPage;
