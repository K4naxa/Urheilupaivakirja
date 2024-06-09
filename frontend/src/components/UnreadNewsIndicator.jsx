import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import publicService from "../services/publicService";

// Assuming publicService is accessible and has the relevant methods
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
    queryFn: publicService.checkUnreadNews,
    refetchInterval: 1000 * 60 * 5,
  });

  // onSuccess
  useEffect(() => {
    if (isSuccess) {
      setHasUnreadNews(unreadNews.hasUnreadNews);
    }
  }, [isSuccess]);

  const updateNewsLastViewedAtMutation = useMutation({
    mutationFn: publicService.updateNewsLastViewedAt,
    onSuccess: () => {},
  });

  // update news_last_viewed_at and mark news as read when students visits the news page
  useEffect(() => {
    if (location.pathname === "/tiedotteet/") {
      updateNewsLastViewedAtMutation.mutate();
      setHasUnreadNews(false);
      queryClient.invalidateQueries(["checkUnreadNews"]);
    }
  }, [location]);

  if (isLoading) {
    return null;
  }

  const size = type === "phone" ? "w-2 h-2" : "w-1.5 h-1.5";

  const position =
    type === "phone"
      ? "top-neg-one right-neg-one"
      : "top-2.5 right-neg-one-point-five";

  return (
    hasUnreadNews && (
      <div className={`absolute ${position}`}>
        <span className={`block ${size} bg-red-500 rounded-full`}></span>
      </div>
    )
  );
};

export default UnreadNewsIndicator;
