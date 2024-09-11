import apiClient from "./apiClient";

const getCourseSegments = async () => {
    const response = await apiClient.get("/course/segment");
    return response.data;
  };
  const updateCourseSegments = async (segments) => {
    const response = await apiClient.put(
      "/course/segment",
      { segments }
    );
    return response.data;
  };
  
  const createCourseSegment = async (segment) => {
    const response = await apiClient.post(
      "/course/segment",
      segment
    );
    return response.data;
  };
  
  const deleteCourseSegment = async (id) => {
    const response = await apiClient.delete(
      `/course/segment/${id}`
    );
    return response.data;
  };

export default {
    getCourseSegments,
    updateCourseSegments,
    createCourseSegment,
    deleteCourseSegment
}