import apiClient from "./apiClient";

// get all news
const getNews = async () => {
  const response = await apiClient.get("/news/");
  return response.data;
};

const getNewsById = async (id) => {
  const response = await apiClient.get(`/news/${id}`);
  return response.data;
}

// get unread news count
const checkUnreadNews = async () => {
  const response = await apiClient.get("/news/unread");
  return response.data;
};

// update students.news_last_viewed_at when student views news
const updateNewsLastViewedAt = async () => {
  const response = await apiClient.put(
    "/news/update-student-news-last-viewed-at",
    {}
  );
  return response.data;
};

const postNews = async (news) => {
  const response = await apiClient.post("/news/", news);
  return response.data;
};

const putNews = async (news) => {
  const response = await apiClient.put(`/news/${news.id}`, news);
  return response.data;
}

const deleteNews = async (id) => {
  const response = await apiClient.delete(`/news/${id}`);
  return response.data;
}

export default {
  getNews,
  getNewsById,
  checkUnreadNews,
  updateNewsLastViewedAt,
  postNews,
  putNews,
  deleteNews,
};
