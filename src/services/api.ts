import axios from "axios";

const API_URL = "http://localhost:3000"; // Change this to your backend URL

export const generateInterviewResponse = async (
  question: string,
  response: string
) => {
  const payload = {
    question,
    response,
  };

  const result = await axios.post(`${API_URL}/api/interview`, payload);
  return result.data;
};

export const getQuestions = async () => {
  const result = await axios.get(`${API_URL}/api/questions`);
  return result.data;
};
