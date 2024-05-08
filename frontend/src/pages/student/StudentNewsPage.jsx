import { useState, useEffect } from "react";
import publicService from "../../services/publicService";
import { useQuery } from "@tanstack/react-query";

const renderSingleNews = (news) => {
  return (
    <div
      className="bg-bgkSecondary p-4 shadow-md rounded-md max-w-96"
      key={news.id}
    >
      <h3 className="text-lg text-center mb-2 font-semibold">{news.title}</h3>
      <p>{news.content}</p>
    </div>
  );
};

const StudentNewsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: () => publicService.getNews(),
  });

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="">
      <div
        className="lg:hidden text-2xl text-center py-4 bg-headerPrimary w-full
       rounded-b-md shadow-md"
      >
        Tiedotteet
      </div>
      <div className="flex lg:flex-col flex-wrap m-4 gap-8 justify-center">
        {data.map((news) => renderSingleNews(news))}
      </div>
    </div>
  );
};

export default StudentNewsPage;
