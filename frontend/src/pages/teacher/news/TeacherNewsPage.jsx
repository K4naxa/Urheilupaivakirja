import { useState, useEffect } from "react";
import newsService from "../../../services/newsService";
import { useQuery } from "@tanstack/react-query";
import cc from "../../../utils/cc";
import LoadingScreen from "../../../components/LoadingScreen";
import { format } from "date-fns";
import { FiEdit3 } from "react-icons/fi";
import { useBigModal } from "../../../hooks/useBigModal";

const RenderSingleNews = ({ news }) => {
  const [opened, setOpened] = useState(false);
  const toggleOpen = () => setOpened(!opened);
  const { openBigModal } = useBigModal();
  console.log(news);
  return (
    <div
      className="bg-bgSecondary p-4 rounded-md md:max-w-96 border border-borderPrimary cursor-pointer hover:bg-bgPrimary"
      onClick={toggleOpen}
    >
      <div className="w-full border-b border-borderPrimary px-1 relative">
        <button
          onClick={(event) => {
            event.stopPropagation();
            openBigModal("editNewsEntry", { entryId: news.id });
          }}
          className="text-iconGray absolute top-1 right-1 hover:text-primaryColor"
        >
          <FiEdit3 size={20} />
        </button>
        <h3 className="text-lg text-center font-medium">{news.title}</h3>
        <div className="text-sm flex p-1 text-textSecondary text-start">
          <span>{format(new Date(news.created_at), "dd.MM.yyyy")}</span>
          <span className="ml-auto">{news.author}</span>
        </div>
      </div>
      <div className="flex text-sm flex-wrap pt-2">
        {news.campuses && news.campuses.length > 0 && (
          <div className="rounded-xl bg-btnGray text-textPrimary border-2 mx-1 px-2">
            {news.campuses.map((campus, index) => (
              <span key={index} className="tag">
                {campus}
              </span>
            ))}
          </div>
        )}
        {news.sports && news.sports.length > 0 && (
          <div className="rounded-xl bg-btnGray text-textPrimary border-2 mx-1 px-2">
            {news.sports.map((sport, index) => (
              <span key={index} className="tag">
                {sport}
              </span>
            ))}
          </div>
        )}
        {news.student_groups && news.student_groups.length > 0 && (
          <div className="rounded-xl bg-btnGray text-textPrimary border-2 mx-1 px-2">
            {news.student_groups.map((group, index) => (
              <span key={index} className="tag">
                {group}
              </span>
            ))}
          </div>
        )}
        <span className="ml-2">{news.category}</span>
      </div>
      <p className={cc(opened ? "" : "line-clamp-3", "pt-2", "mx-1")}>
        {news.content}
      </p>
    </div>
  );
};

const TeacherNewsPage = () => {
  const { openBigModal } = useBigModal();

  const {
    data: newsData,
    isLoading: newsIsLoading,
    error: newsError,
  } = useQuery({
    queryKey: ["news"],
    queryFn: () => newsService.getNews(),
  });

  const {
    data: optionsData,
    isLoading: optionsIsLoading,
    error: optionsError,
  } = useQuery({
    queryKey: ["options"],
    queryFn: () => miscService.getGroupsSportsCampusesOptions(),
  });

  if (newsIsLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingScreen />
      </div>
    );
  }

  if (newsError) return <p>Error: {newsError.message}</p>;

  return (
    <div className="flex w-full h-full justify-center">
      <div className="flex w-full md:w-fit flex-col gap-4 p-4 bg-bgSecondary rounded-md border border-borderPrimary">
        <header className="w-full py-4 text-xl text-textPrimary text-center border-b border-borderPrimary ">
          Tiedotteet
        </header>
        <div className="flex justify-around gap-4 flex-wrap items-end">
          {/*
          <div className="flex gap-4">
            <input
              type="text"
              name="newsSearch"
              id="newsSearchInput"
              placeholder="Hae tiedotteita"
              className="bg-bgGray rounded-md border border-borderPrimary px-2 h-10"
            />
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col">
              {" "}
              <label
                htmlFor="selectFocusGroup"
                className="text-sm text-textSecondary px-2"
              >
                Suodata:
              </label>
              <select
                name="selectFocusGroup"
                id="selectFocusGroup"
                className="bg-bgSecondary border border-borderPrimary text-textSecondary p-2 rounded-md
           hover:cursor-pointer hover:bg-bgPrimary focus-visible:outline-none focus:bg-bgPrimary"
              >
                <option value="all">Kaikki</option>
                <option value="school">oma koulu</option>
                <option value="group">oma ryhmä</option>
                <option value="sport">oma laji</option>
              </select>
            </div>
            <div className="flex flex-col">
              {" "}
              <label
                htmlFor="selectSorting"
                className="text-sm text-textSecondary px-2"
              >
                Järjestys:
              </label>
              <select
                name="selectSorting"
                id="selectSorting"
                className="bg-bgSecondary border border-borderPrimary text-textSecondary p-2 rounded-md
           hover:cursor-pointer hover:bg-bgPrimary focus-visible:outline-none focus:bg-bgPrimary"
              >
                <option value="newest">Uusimmat</option>
                <option value="oldest">Vanhimmat</option>
              </select>
            </div>
          </div>
  */}
          <button
            onClick={() => openBigModal("newNewsEntry")}
            className="px-4 py-2 border border-borderPrimary rounded-md bg-primaryColor text-white
              hover:bg-hoverPrimary"
          >
            {`+ Uusi tiedote`}
          </button>
        </div>

        <div className="grid justify-center md:grid-cols-2 m-4 auto-rows-max gap-8">
          {newsData.map((news) => (
            <RenderSingleNews key={news.id} news={news} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherNewsPage;
