import apiClient from "./apiClient";

// multiple journal entries or whole journal -------------------------------------------------------------------

const getUserJournalEntriesByUserId = async (user_id) => {
  const response = await apiClient.get(
    `/journal/user/${user_id}`
  );
  return response.data;
};

const getAllUserJournalEntries = async () => {
  const response = await apiClient.get("/journal/user");
  return response.data;
};

const getUserJournalEntriesByDate = async (date) => {
  const response = await apiClient.get(
    `/journal/user/date/${date}`
  );
  return response.data;
};

// single entries -------------------------------------------------------------------

const getJournalEntry = async (id) => {
  const response = await apiClient.get(`/journal/entry/${id}`);
  return response.data;
};

// get journal entry that is formatted for the "edit journal entry" form
const getJournalEntryForForm = async (id) => {
  const response = await apiClient.get(`/journal/entry/${id}`);
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
    intensity: journalEntry.workout_intensity_id
      ? journalEntry.workout_intensity_id.toString()
      : "",
    date: journalEntry.date
      ? dayjs(journalEntry.date).format("YYYY-MM-DD")
      : "",
    details: journalEntry.details || "",
  };
};

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
  const response = await apiClient.post(
    "/journal/entry",
    entryToSend
  );
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
  const response = await apiClient.put(
    `/journal/entry/${id}`,
    updatedJournalEntry
  );
  return response.data;
};

// delete existing journal entry
const deleteJournalEntry = async (id) => {
  const response = await apiClient.delete(`/journal/entry/${id}`);
  return response.data;
};

export default {
  getUserJournalEntriesByUserId,
  getAllUserJournalEntries,
  getUserJournalEntriesByDate,
  getJournalEntry,
  getJournalEntryForForm,
  postJournalEntry,
  editJournalEntry,
  deleteJournalEntry,
};
