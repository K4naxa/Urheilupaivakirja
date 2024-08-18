import axios from "axios";
import dayjs from "dayjs";

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

// Journal Entries --------------------------------------------------------------------

const getUserJournalEntriesByUserId = async (user_id) => {
  const response = await axios.get(`/journal/user/${user_id}`, makeHeader());
  return response.data;
};

const getAllUserJournalEntries = async () => {
  const response = await axios.get("/journal/user", makeHeader());
  return response.data;
};

// get journal entries by date
const getUserJournalEntriesByDate = async (date) => {
  const response = await axios.get(`/journal_entry/date/${date}`, makeHeader());
  return response.data;
};

// get journal entry by id
const getJournalEntry = async (id) => {
  const response = await axios.get(`/journal_entry/${id}`, makeHeader());
  return response.data;
};

const getJournalEntryForForm = async (id) => {
  const response = await axios.get(`/journal_entry/${id}`, makeHeader());
  const journalEntry = response.data;
  return {
    entry_id: journalEntry.entry_id ? journalEntry.entry_id.toString() : "",
    entry_type: journalEntry.entry_type_id
      ? journalEntry.entry_type_id.toString()
      : "",
    workout_type: journalEntry.workout_type_id
      ? journalEntry.workout_type_id.toString()
      : "",
    workout_category: journalEntry.workout_category_id
      ? journalEntry.workout_category_id.toString()
      : "",
    length_in_minutes: journalEntry.length_in_minutes
      ? journalEntry.length_in_minutes.toString()
      : "",
    time_of_day: journalEntry.time_of_day_id
      ? journalEntry.time_of_day_id.toString()
      : "",
    workout_intensity: journalEntry.workout_intensity_id
      ? journalEntry.workout_intensity_id.toString()
      : "",
    date: journalEntry.date
      ? dayjs(journalEntry.date).format("YYYY-MM-DD")
      : "",
    details: journalEntry.details || "",
  };
};

// ................................................................................

// post new journal entry

const postJournalEntry = async (journalEntry) => {
  var entryToSend = {};
  if (journalEntry.entry_type === "1") {
    entryToSend = {
      entry_type_id: journalEntry.entry_type,
      workout_type_id: journalEntry.workout_type,
      workout_category_id: journalEntry.workout_category,
      time_of_day_id: journalEntry.time_of_day,
      length_in_minutes: journalEntry.length_in_minutes,
      workout_intensity_id: journalEntry.intensity,
      details: journalEntry.details,
      date: journalEntry.date,
    };
  } else {
    entryToSend = {
      entry_type_id: journalEntry.entry_type,
      details: journalEntry.details,
      date: journalEntry.date,
    };
  }
  const response = await axios.post(
    "/journal_entry",
    entryToSend,
    makeHeader()
  );
  return response.data;
};

// get journal entry options (journal_entry_types, workout_types, workout_categories) for creating a new journal entry
const getJournalEntryOptions = async () => {
  const response = await axios.get("/journal_entry/options", makeHeader());
  return response.data;
};

// edit existing journal entry
const editJournalEntry = async (journalEntry) => {
  let id = journalEntry.entry_id;
  let updatedJournalEntry = {};
  if (journalEntry.entry_type === "1") {
    updatedJournalEntry = {
      id: journalEntry.entry_id,
      entry_type_id: journalEntry.entry_type,
      workout_type_id: journalEntry.workout_type,
      workout_category_id: journalEntry.workout_category,
      time_of_day_id: journalEntry.time_of_day,
      length_in_minutes: journalEntry.length_in_minutes,
      workout_intensity_id: journalEntry.intensity,
      details: journalEntry.details,
      date: journalEntry.date,
    };
  } else {
    updatedJournalEntry = {
      id: journalEntry.entry_id,
      entry_type_id: journalEntry.entry_type,
      workout_type_id: null,
      workout_category_id: null,
      time_of_day_id: null,
      length_in_minutes: null,
      workout_intensity_id: null,
      details: journalEntry.details,
      date: journalEntry.date,
    };
  }

  const response = await axios.put(
    `/journal_entry/${id}`,
    updatedJournalEntry,
    makeHeader()
  );
  return response.data;
};

// delete journal entry
const deleteJournalEntry = async (id) => {
  const response = await axios.delete(`/journal_entry/${id}`, makeHeader());
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

// ................................................................................
const getCourseSegments = async () => {
  const response = await axios.get("/courseInfo/courseSegments", makeHeader());
  return response.data;
};
const updateCourseSegments = async (segments) => {
  const response = await axios.put(
    "/courseInfo/courseSegments",
    { segments },
    makeHeader()
  );
  return response.data;
};

const createCourseSegment = async (segment) => {
  const response = await axios.post(
    "/courseInfo/courseSegments",
    segment,
    makeHeader()
  );
  return response.data;
};

const deleteCourseSegment = async (id) => {
  const response = await axios.delete(
    `/courseInfo/courseSegments/${id}`,
    makeHeader()
  );
  return response.data;
};

export default {
  getAllUserJournalEntries,
  getUserJournalEntriesByUserId,
  getUserJournalEntriesByDate,
  postJournalEntry,
  editJournalEntry,
  deleteJournalEntry,
  getJournalEntry,
  getJournalEntryForForm,
  getJournalEntryOptions,
  getSports,
  getSport,
  addSport,
  editSport,
  deleteSport,
  getCourseSegments,
  updateCourseSegments,
  createCourseSegment,
  deleteCourseSegment,
};
