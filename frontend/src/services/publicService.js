import axios from "axios";

const getOptions = async () => {
  const response = await axios.get("/public/options");
  return response.data;
};

export { getOptions };
