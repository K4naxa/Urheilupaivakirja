import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../hooks/toast-messages/useToast.jsx";
import dayjs from "dayjs";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import newsService from "../../../services/newsService";

const NewNewsEntryPage = ({ onClose }) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const initialDate = dayjs(new Date()).format("YYYY-MM-DD");

  const [newNewsEntryData, setNewNewsEntryData] = useState({
    title: "",
    content: "",
    date: initialDate,
    public: true,
    pinned: false,
    categories: [],
  });

  const conflict = {
    messageShort: "",
    messageLong: "",
  };

  const addNews = useMutation({
    mutationFn: () => 
      newsService.postNews(newNewsEntryData)
    ,
    onError: (error) => {
      console.error("Error posting news entry:", error);

      let errorMessage = "Virhe julkaistessa tiedotetta.";

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage =
              "Virheellinen pyyntö. Tarkista tiedot ja yritä uudelleen.";
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
      addToast("Uutinen lisätty", { style: "success" });
      queryClient.invalidateQueries({ queryKey: ["news"] });
      onClose();
    },
  });

  const submitButtonIsDisabled = false;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewNewsEntryData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const newNewsEntryHandler = async (event) => {
    event.preventDefault();

    // Check if the selected date is in the future
    const today = dayjs().startOf("day");
    const selectedDate = dayjs(newNewsEntryData.date);

    if (selectedDate.isAfter(today)) {
      setNewNewsEntryData((prevData) => ({
        ...prevData,
        date: today,
      }));
      addToast("Et voi julkaista tiedotetta tulevaisuuteen", { style: "error" });
      return;
    }

    addNews.mutate();
  };

  const handleTitleTextareaChange = (e) => {
    const textarea = e.target;
    textarea.value = textarea.value.replace(/\n/g, ""); // removing line breaks
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    handleInputChange(e);
  };

  const handleContentTextareaChange = (e) => {
    const textarea = e.target;
    const lineHeight = parseInt(
      window.getComputedStyle(textarea).lineHeight,
      10
    );
    const maxRows = 10;

    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, lineHeight * maxRows);

    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > newHeight ? "auto" : "hidden";
    handleInputChange(e);
  };

  return (
    <div className="flex flex-col h-full sm:rounded-md overflow-auto hide-scrollbar transition-transform duration-300">
      <div className="relative bg-primaryColor p-3 sm:p-4 text-center text-white text-xl shadow-md sm:rounded-t-md">
        <p className="sm:min-w-[400px] cursor-default">Uusi tiedote</p>
        <button
          onClick={onClose}
          className="absolute bottom-1/2 translate-y-1/2 left-5 text-2xl hover:scale-125 transition-transform duration-150"
        >
          <FiArrowLeft />
        </button>
      </div>
      <form
        className="flex flex-col items-center gap-1 sm:gap-2 p-4 sm:px-8 bg-bgSecondary sm:rounded-b-md flex-grow"
        onSubmit={newNewsEntryHandler}
      >
        {/* Title Input */}
        <div className="w-full">
          <label className="block text-sm font-medium text-textPrimary">
            Otsikko{" "}
            <span className="text-textPrimary text-opacity-40">
              ({newNewsEntryData.title.length}/50)
            </span>
          </label>
          <textarea
            name="title"
            value={newNewsEntryData.title}
            onChange={handleTitleTextareaChange} // Use the new handler
            maxLength={50} // Set the max length to 50 characters
            className="mt-1 block w-full border-borderPrimary text-textPrimary bg-bgPrimary rounded-md shadow-sm focus:border-primaryColor focus:ring-primaryColor p-1 sm:text-sm"
            rows={1} // Start with 1 row
            style={{ resize: "none" }} // Prevent manual resizing
            required
          />
        </div>
        <div className="w-full">
          {/* Content Input */}
          <label className="block text-sm font-medium text-textPrimary">
            Sisältö{" "}
            <span className="text-textPrimary text-opacity-40">
              ({newNewsEntryData.content.length}/1000)
            </span>
          </label>
          <textarea
            name="content"
            value={newNewsEntryData.content}
            onChange={handleContentTextareaChange}
            className="mt-1 block w-full border-borderPrimary text-textPrimary bg-bgPrimary rounded-md shadow-sm focus:border-primaryColor focus:ring-primaryColor p-1 sm:text-sm"
            rows={5}
            maxLength={1000}
            style={{ resize: "none", overflowY: "hidden" }} // Prevent manual resizing and hide scrollbar initially
            required
          />
        </div>
        {/* Date Input */}
        <div className="w-full">
          <label className="block text-sm font-medium text-textPrimary">
            Päivämäärä
          </label>
          <input
            type="date"
            name="date"
            value={newNewsEntryData.date}
            onChange={handleInputChange}
            className="text-textPrimary border-borderPrimary h-9 w-full bg-bgSecondary focus-visible:outline-none border-b py-1"
            required
          />
        </div>

        {/* Pinned */}
        <div className="w-full flex items-center justify-between">
          <label className="block text-sm font-medium text-textPrimary">
            Kiinnitetty
          </label>
          <input
            type="checkbox"
            name="pinned"
            checked={newNewsEntryData.pinned}
            onChange={handleInputChange}
            className="h-4 w-4 text-primaryColor border-borderPrimary rounded focus:ring-primaryColor"
          />
        </div>
        {/* 
        {/* Public Toggle
        <div className="w-full flex items-center justify-between">
          <label className="block text-sm font-medium text-textPrimary">
            Public
          </label>
          <input
            type="checkbox"
            name="public"
            checked={newNewsEntryData.public}
            onChange={handleInputChange}
            className="h-4 w-4 text-primaryColor border-borderPrimary rounded focus:ring-primaryColor"
          />
        </div>



        {/* Categories Input - Placeholder
        <div className="w-full">
          <label className="block text-sm font-medium text-textPrimary">
            Categories
          </label>
        </div>
      */}
        {/* Conflict Message and Submit Button */}
        <div className="flex flex-col text-red-400 text-center items-center gap-4 w-full p-4 mt-auto">
          {conflict.messageShort && <p>{conflict.messageShort}</p>}
          <button
            className={`min-w-[160px] text-white px-4 py-4 rounded-md bg-primaryColor border-borderPrimary active:scale-95 transition-transform duration-75 hover:bg-hoverPrimary ${
              submitButtonIsDisabled
                ? "bg-gray-400 opacity-20 text-gray border-borderPrimary cursor-not-allowed"
                : "cursor-pointer"
            }`}
            type="submit"
            disabled={submitButtonIsDisabled}
          >
            Lisää tiedote
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewNewsEntryPage;
