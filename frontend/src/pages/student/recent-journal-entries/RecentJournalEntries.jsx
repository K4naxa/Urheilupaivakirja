import { useEffect, useState } from "react";
import trainingService from "../../../services/trainingService.js";
import "./recentJournalEntries.css";
import { useNavigate } from "react-router-dom";

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

function formatDateString(isoDateString) {
  const date = new Date(isoDateString);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateToDisplay(isoDateString) {
  const formattedDate = formatDateString(isoDateString);
  const [year, month, day] = formattedDate.split("-");
  return `${day}.${month}.${year}`;
}

const RecentJournalEntry = ({ entry }) => {
  const navigate = useNavigate();
  return (
    <div className="recent-journal-entry-container">
      <div className="recent-journal-entry-top-container">
        {entry.entry_type &&
          (entry.entry_type === "Lepo" || entry.entry_type === "Sairaana") && (
            <p className="recent-journal-entry-type">{entry.entry_type}</p>
          )}
        {entry.date && (
          <p className="recent-journal-entry-date">
            {formatDateToDisplay(entry.date)}
          </p>
        )}
        <button
          onClick={() => navigate(`/merkinnat/muokkaa/${entry.id}`)}
          className="recent-journal-entry-edit-button"
        >
          Muokkaa
        </button>
      </div>
      <div className="recent-journal-entry-middle-container">
        {entry.length_in_minutes && (
          <div className="recent-journal-entry-detail">
            <span className="label">Kesto:</span>
            <span className="value">
              {convertTime(entry.length_in_minutes)}
            </span>
          </div>
        )}
        {entry.time_of_day && (
          <div className="recent-journal-entry-detail">
            <span className="label">Ajankohta:</span>
            <span className="value">{entry.time_of_day}</span>
          </div>
        )}

        {entry.workout_type && (
          <div className="recent-journal-entry-detail">
            <span className="label">Tyyppi:</span>
            <span className="value">{entry.workout_type}</span>
          </div>
        )}
        {entry.workout_category && (
          <div className="recent-journal-entry-detail">
            <span className="label">Kategoria:</span>
            <span className="value">{entry.workout_category}</span>
          </div>
        )}
        {entry.intensity && (
          <div className="recent-journal-entry-detail">
            <span className="label">Rankkuus:</span>
            <span className="value">{entry.intensity}</span>
          </div>
        )}
      </div>
      <div className="recent-journal-entry-bottom-container">
        {entry.details && (
          <div className="recent-journal-entry-detail">
          <span className="label">Lisätiedot:</span>
          <span className="value">{entry.details}</span>
        </div>
        )}
      </div>
    </div>
  );
};

const RecentJournalEntries = () => {
  const [recentEntries, setRecentEntries] = useState([]);
  useEffect(() => {
    //TODO: get recent journal entries instead of all
    const fetchRecentJournalEntries = async () => {
      try {
        const data = await trainingService.getAllUserJournalEntries();
        setRecentEntries(data);
      } catch (error) {
        console.error("Failed to fetch journal entries:", error);
      }
    };
    fetchRecentJournalEntries();
  }, []);
  
  return (
    <div className="recent-journal-entries-horizontal-container">
      <div className="recent-journal-entries-vertical-container">
        {recentEntries.map((entry) => (
          <RecentJournalEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
};

export default RecentJournalEntries;
