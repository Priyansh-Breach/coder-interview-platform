import React from 'react';
import { useForm } from 'react-hook-form';
import { generateInterviewResponse, getQuestions } from '../services/api';

const InterviewForm: React.FC<{ setResults: (data: any) => void }> = ({ setResults }) => {
  const { register, handleSubmit } = useForm();
  const [questions, setQuestions] = React.useState<string[]>([]);

  React.useEffect(() => {
    (async () => {
      const data = await getQuestions();
      setQuestions(data.questions);
    })();
  }, []);

  const onSubmit = async (data: any) => {
    const response = await generateInterviewResponse(data.question, data.response);
    setResults(response);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="question">Question</label>
        <select {...register('question')}>
          {questions.map((question, index) => (
            <option key={index} value={question}>
              {question}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="response">Your Response</label>
        <textarea {...register('response')} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default InterviewForm;
