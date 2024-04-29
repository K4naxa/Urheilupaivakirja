import { useState, useEffect } from "react";
import publicService from "../../../services/publicService";
import {useQuery } from "@tanstack/react-query";

const renderSingleNews = (news) => {
  return (
    <div key={news.id}>
      <h3>{news.title}</h3>
      <p>{news.content}</p>
    </div>
  );
};

const StudentNewsPage = () => {
  const {data, isLoading, error} = useQuery({queryKey: ["news"], queryFn: () => publicService.getNews()});

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;
  /*
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const news = await publicService.getNews();
        setNews(news);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const updateNewsLastViewedAt = async () => {
      try {
        await publicService.updateNewsLastViewedAt();
      } catch (error) {
        console.error(error);
      }
    };
    if (news.length > 0) {
      updateNewsLastViewedAt();
    }
  }, [news]);
*/
  return <div>{data.map((news) => renderSingleNews(news))}</div>;
};

export default StudentNewsPage;
