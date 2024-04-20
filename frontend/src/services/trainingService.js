import axios from "axios";

// get token from localStorage
const getToken = () => {
  const userJson = localStorage.getItem("user");
  if (userJson) {
    const user = JSON.parse(userJson);
    return user.token;
  }
  return null;
};

// make authorization header
const makeHeader = () => {
  let header = { headers: { Authorization: `bearer ${getToken()}` } };
  return header;
};

// ................................................................................

// get journal entries by date
const getUserJournalEntriesByDate = async (date) => {
  const response = await axios.get(`/journal_entry/date/${date}`, makeHeader());
  return response.data;
}

// ................................................................................

// post new journal entry

const postJournalEntry = async (
  entry_type_id,
  workout_type_id,
  workout_category_id,
  time_of_day_id,
  length_in_minutes,
  intensity,
  details,
  date,
) => {
  let journalEntry = {
    entry_type_id,
    workout_type_id,
    workout_category_id,
    time_of_day_id,
    length_in_minutes,
    intensity,
    details,
    date,
  };

  const response = await axios.post(
    "/journal_entry",
    journalEntry,
    makeHeader()
  );
  return response.data;
};

const getJournalEntry = async (id) => {
  const response = await axios.get(`/journal_entry/${id}`, makeHeader());
  return response.data;

}

// get journal entry options (journal_entry_types, workout_types, workout_categories)
const getJournalEntryOptions = async () => {
  const response = await axios.get("/journal_entry/options", makeHeader());
  return response.data;
};

// ................................................................................

// get all sports
const getSports = async () => {
  const response = await axios.get("/sports", makeHeader());
  return response.data;
};

// get a single sport by id
const getSport = async (id) => {
  const response = await axios.get(`/sports/${id}`, makeHeader());
  return response.data;
};

// add a new sport
const addSport = async (sport) => {
  const response = await axios.post("/sports", sport, makeHeader());
  return response.data;
};

// edit a single sport by id
const editSport = async (sport) => {
  const id = sport.id;
  const response = await axios.put(
    `/sports/${id}`,
    { name: sport.name },
    makeHeader()
  );
  return response.data;
};

// delete a single sport by id
const deleteSport = async (id) => {
  const response = await axios.delete(`/sports/${id}`, makeHeader());
  return response.data;
};

export default {
  getUserJournalEntriesByDate,
  postJournalEntry,
  getJournalEntry,
  getJournalEntryOptions,
  getSports,
  getSport,
  addSport,
  editSport,
  deleteSport,
};
