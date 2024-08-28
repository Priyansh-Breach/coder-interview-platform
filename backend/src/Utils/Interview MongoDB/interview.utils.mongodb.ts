import { InterviewModel } from "../../entities/interview";

export async function createInterview(
  userId: string,
  questionId: string,
  interViewDuration: any
) {
  const newInterview = new InterviewModel({
    userId: userId,
    questionId: questionId,
    status: "active",
    duration: interViewDuration,
  });

  await newInterview.save();

  return newInterview;
}

export async function leaveInterviewMongo(
  userId: any,
  questionId: any,
  tokenRemainingTime: any
) {
  try {
    const update = {
      status: "canceled",
      timeLeft: tokenRemainingTime,
    };

    await InterviewModel.findOneAndUpdate(
      {
        userId: userId,
        questionId: questionId,
        status: "active",
      },
      update
    );
  } catch (error: any) {
    console.log("Error in updating the interview status in MongoDB : ", error);
  }
}
