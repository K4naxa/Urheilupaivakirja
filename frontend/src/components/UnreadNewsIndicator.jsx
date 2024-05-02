import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import publicService from "../services/publicService";

// Assuming publicService is accessible and has the relevant methods
function UnreadNewsIndicator() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [hasUnreadNews, setHasUnreadNews] = useState(false);

  // check unread news every 5 minutes
  const { data: unreadNews, isSuccess, isLoading} = useQuery({
      queryKey: ['checkUnreadNews'],
      queryFn: publicService.checkUnreadNews,
      refetchInterval: 300000,
  });

  // onSuccess
  useEffect(() => {
      if (isSuccess) {
          setHasUnreadNews(unreadNews.hasUnreadNews);
          console.log("Unread news checked successfully")
      }
  }, [isSuccess]);

  const updateNewsLastViewedAtMutation = useMutation({
    mutationFn: publicService.updateNewsLastViewedAt,
    onSuccess: () => {
      console.log("news_last_viewed_at updated successfully");
    },
  });

  // update news_last_viewed_at and mark news as read when students visits the news page
  useEffect(() => {
      if (location.pathname === '/tiedotteet/') {
          updateNewsLastViewedAtMutation.mutate();
          setHasUnreadNews(false);
          queryClient.invalidateQueries(['checkUnreadNews']);
      }
  }, [location]);


  if (isLoading) {
    return <span></span>;
}

  return (
    <>
      {hasUnreadNews ? (
        //TODO: TYYLITTELY
        <span style={{ color: "red" }}>Uusia viestejä</span>
      ) : (
        <span style={{ color: "blue" }}>Ei uusia viestejä</span>
      )}
    </>
  );
}

export default UnreadNewsIndicator;
