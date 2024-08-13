import { useState, useEffect } from "react";
import publicService from "../../services/publicService";
import { useQuery } from "@tanstack/react-query";
import cc from "../../utils/cc";
import LoadingScreen from "../../components/LoadingScreen";
import { format } from "date-fns";
import {FiArrowLeft} from "react-icons/fi";
import { Link } from "react-router-dom";

const RenderSingleNews = ({ news }) => {
  const [opened, setOpened] = useState(false);
  const toggleOpen = () => setOpened(!opened);
  return (
    <div
      className="bg-bgSecondary p-4 rounded-md md:max-w-96 border border-borderPrimary cursor-pointer hover:bg-bgPrimary"
      onClick={toggleOpen}
      /*
    >        <Link to={"/"} className="text-xl flex items-center gap-2">
    <img src={siteLogo} alt="site logo" className="w-8 h-8" />
    Urheilupäiväkirja
  </Link>
  */>

      <div className="w-full border-b border-borderPrimary px-1 relative">
        <h3 className="text-lg text-center font-medium">{news.title}</h3>
        <div className="text-sm flex p-1 text-textSecondary text-start">
          <span >{format(new Date(news.created_at), "dd.MM.yyyy")}</span>
          <span className="ml-auto">{news.author}</span>
        </div>
      </div>
      <div className="flex text-sm flex-wrap pt-2">
        {news.campuses && news.campuses.length > 0 && (
          <div className="rounded-xl bg-btnGray text-textPrimary border-2 mx-1 px-2">
            {news.campuses.map((campus, index) => (
              <span key={index} className="tag">{campus}</span>
            ))}
          </div>
        )}
        {news.sports && news.sports.length > 0 && (
          <div className="rounded-xl bg-btnGray text-textPrimary border-2 mx-1 px-2">
            {news.sports.map((sport, index) => (
              <span key={index} className="tag">{sport}</span>
            ))}
          </div>
        )}
        {news.student_groups && news.student_groups.length > 0 && (
          <div className="rounded-xl bg-btnGray text-textPrimary border-2 mx-1 px-2">
            {news.student_groups.map((group, index) => (
              <span key={index} className="tag">{group}</span>
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

const StudentNewsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: () => publicService.getNews(),
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingScreen />
      </div>
    );
    }

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex w-full h-full justify-center">
      <div className="flex w-full md:w-fit flex-col gap-4 p-4 bg-bgSecondary rounded-md border border-borderPrimary">
        <header className="relative w-full py-4 text-xl text-center border-b border-borderPrimary ">
        <Link to = {"/"}
          className="absolute bottom-1/2 translate-y-1/2 left-5 text-2xl hover:scale-125 transition-transform duration-150"
        >
          <FiArrowLeft />
        </Link>
          Tiedotteet
        </header>

        <div className="grid justify-center md:grid-cols-2 m-4 auto-rows-max gap-8">
          {data.map((news) => (
            <RenderSingleNews key={news.id} news={news} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentNewsPage;
