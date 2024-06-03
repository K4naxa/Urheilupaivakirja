import { useState, useEffect } from "react";
import publicService from "../../services/publicService";
import { useQuery } from "@tanstack/react-query";
import cc from "../../utils/cc";
import LoadingScreen from "../../components/LoadingScreen";
import { format } from "date-fns";

const RenderSingleNews = ({ news }) => {
  const [opened, setOpened] = useState(false);
  const toggleOpen = () => setOpened(!opened);
  console.log(news);
  return (
    <div
      className="bg-bgSecondary p-4 rounded-md max-w-96 border border-borderPrimary cursor-pointer  hover:bg-bgPrimary"
      onClick={toggleOpen}
    >
      <div className="w-full border-b border-borderPrimary pb-4 px-4 relative">
        {" "}
        <h3 className="text-lg text-center  font-semibold ">{news.title}</h3>
        <p className="text-sm text-textSecondary text-start absolute bottom-0 left-1">
          {format(new Date(news.created_at), "dd.MM.yyyy")}
        </p>
      </div>
      <div>
        <p className={cc(opened ? "" : "line-clamp-3", "pt-2")}>
          {news.content}
        </p>
      </div>
    </div>
  );
};

const StudentNewsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: () => publicService.getNews(),
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center">
        <LoadingScreen />
      </div>
    );

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex w-full h-full justify-center">
      <div className="flex w-full md:w-fit flex-col gap-4 p-4 bg-bgSecondary rounded-md border border-borderPrimary">
        <header className="w-full py-4 text-xl text-center font-semibold border-b border-borderPrimary ">
          Tiedotteet
        </header>
        <div className="flex justify-around gap-4 flex-wrap items-end">
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
        </div>

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
