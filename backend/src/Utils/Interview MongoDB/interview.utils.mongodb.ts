import { InterviewModel } from "../../entities/interview";

export async function createInterview(
  userId: string,
  questionId: string,
  interViewDuration: any,
  questionData: any
) {
  const newInterview = new InterviewModel({
    userId: userId,
    questionId: questionId,
    status: "active",
    duration: interViewDuration,
    questionName: questionData?.title,
    slug: questionData?.slug,
    difficulty: questionData?.difficulty,
  });

  await newInterview.save();

  return newInterview;
}

export async function completeInterviewMongo(
  userId: any,
  interviewId: any,
  status: any
) {
  try {
    const update = {
      status: status,
      completedAt: new Date(),
    };

    const result = await InterviewModel.findOneAndUpdate(
      {
        userId: userId,
        _id: interviewId,
        status: "active",
      },
      update,
      { new: true }
    );

    return result;
  } catch (error: any) {
    console.error(
      "Error in marking the interview as complete in MongoDB: ",
      error
    );
  }
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

export async function getUserInterviews(
  userId: string,
  page: number,
  limit: number
) {
  const pageNum = Math.max(page, 1);
  const limitNum = Math.max(limit, 1);
  const skip = (pageNum - 1) * limitNum;

  const interviews = await InterviewModel.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const totalResults = await InterviewModel.countDocuments({ userId });
  const totalPages = Math.ceil(totalResults / limitNum);

  return {
    interviews,
    currentPage: pageNum,
    totalPages,
    totalResults,
  };
}
