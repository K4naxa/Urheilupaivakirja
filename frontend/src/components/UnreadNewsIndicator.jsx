import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import newsService from "../services/newsService";

const UnreadNewsIndicator = ({ type }) => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [hasUnreadNews, setHasUnreadNews] = useState(false);

  // check unread news every 5 minutes
  const {
    data: unreadNews,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["checkUnreadNews"],
    queryFn: newsService.checkUnreadNews,
    refetchInterval: 1000 * 60 * 5,
  });

  // onSuccess
  useEffect(() => {
    if (isSuccess) {
      setHasUnreadNews(unreadNews.hasUnreadNews);
    }
  }, [isSuccess]);

  const updateNewsLastViewedAtMutation = useMutation({
    mutationFn: newsService.updateNewsLastViewedAt,
    onSuccess: () => {},
  });

  // update news_last_viewed_at and mark news as read when students visits the news page
  useEffect(() => {
    if (location.pathname === "/tiedotteet/") {
      console.log("update news last viewed at");
      updateNewsLastViewedAtMutation.mutate();
      setHasUnreadNews(false);
      queryClient.invalidateQueries(["checkUnreadNews"]);
    }
  }, [location]);

  if (isLoading) {
    return null;
  }

  const size = type === "phone" ? "w-2 h-2" : "w-2 h-2";

  const position =
    type === "phone"
      ? "top-neg-one right-neg-one"
      : "top-1 right-5";

  return (
    hasUnreadNews && (
      <div className={`absolute ${position}`}>
        <span className={`block ${size} bg-red-500 rounded-full`}></span>
      </div>
    )
  );
};

export default UnreadNewsIndicator;
