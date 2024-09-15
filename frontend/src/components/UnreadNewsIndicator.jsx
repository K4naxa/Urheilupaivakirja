import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import newsService from "../services/newsService";

const UnreadNewsIndicator = ({ type }) => {
  const location = useLocation();
  const queryClient = useQueryClient();

  // Fetch unread news every 10 minutes
  const {
    data: unreadNews,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["checkUnreadNews"],
    queryFn: newsService.checkUnreadNews,
    refetchInterval: 1000 * 60 * 10,
  });

  const updateNewsLastViewedAtMutation = useMutation({
    mutationFn: newsService.updateNewsLastViewedAt,
    onSuccess: () => {},
  });

  // Update news_last_viewed_at and mark news as read when the user visits the news page
  useEffect(() => {
    if (location.pathname === "/tiedotteet/") {
      console.log("update news last viewed at");
      updateNewsLastViewedAtMutation.mutate();

      // Update the query data directly to avoid unnecessary refetch
      queryClient.setQueryData(["checkUnreadNews"], (oldData) => {
        if (oldData) {
          return { ...oldData, hasUnreadNews: false };
        } else {
          return oldData;
        }
      });
    }
  }, [location.pathname]);


  

  if (isLoading) {
    return null;
  }

  const size = type === "phone" ? "w-2 h-2" : "w-2 h-2";
  const position =
    type === "phone" ? "top-neg-one right-neg-one" : "top-1 right-5";

  return (
    unreadNews?.hasUnreadNews && (
      <div className={`absolute ${position}`}>
        <span className={`block ${size} bg-red-500 rounded-full`}></span>
      </div>
    )
  );
};

export default UnreadNewsIndicator;
