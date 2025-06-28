import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js";
import { LectureQuestion } from "../models/lectureQuestion.model.js";

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // step-1 fetch the user course progress
    let courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    }).populate("courseId");

    const courseDetails = await Course.findById(courseId).populate("lectures");

    if (!courseDetails) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Step-2 If no progress found, return course details with an empty progress
    if (!courseProgress) {
      return res.status(200).json({
        data: {
          courseDetails,
          progress: [],
          completed: false,
        },
      });
    }

    // Step-3 Return the user's course progress alog with course details
    return res.status(200).json({
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;

    // fetch or create course progress
    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      // If no progress exist, create a new record
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }

    // find the lecture progress in the course progress
    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lectureId === lectureId
    );

    if (lectureIndex !== -1) {
      // if lecture already exist, update its status
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      // Add new lecture progress
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    }

    // if all lecture is complete
    const lectureProgressLength = courseProgress.lectureProgress.filter(
      (lectureProg) => lectureProg.viewed
    ).length;

    const course = await Course.findById(courseId);

    if (course.lectures.length === lectureProgressLength)
      courseProgress.completed = true;

    await courseProgress.save();

    return res.status(200).json({
      message: "Lecture progress updated successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};

export const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress)
      return res.status(404).json({ message: "Course progress not found" });

    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = true)
    );
    courseProgress.completed = true;
    await courseProgress.save();
    return res.status(200).json({ message: "Course marked as completed." });
  } catch (error) {
    console.log(error);
  }
};

export const markAsInCompleted = async (req, res) => {
    try {
      const { courseId } = req.params;
      const userId = req.id;
  
      const courseProgress = await CourseProgress.findOne({ courseId, userId });
      if (!courseProgress)
        return res.status(404).json({ message: "Course progress not found" });
  
      courseProgress.lectureProgress.map(
        (lectureProgress) => (lectureProgress.viewed = false)
      );
      courseProgress.completed = false;
      await courseProgress.save();
      return res.status(200).json({ message: "Course marked as incompleted." });
    } catch (error) {
      console.log(error);
    }
  };

// Student asks a question
export const askLectureQuestion = async (req, res) => {
  try {
    const { courseId, lectureId, question } = req.body;
    const studentId = req.id;
    if (!courseId || !lectureId || !question) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }
    const newQuestion = await LectureQuestion.create({
      courseId,
      lectureId,
      studentId,
      question,
    });
    res.status(201).json({ success: true, data: newQuestion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all questions for a lecture
export const getLectureQuestions = async (req, res) => {
  try {
    const { courseId, lectureId } = req.query;
    if (!courseId || !lectureId) {
      return res.status(400).json({ success: false, message: "courseId and lectureId are required." });
    }
    const questions = await LectureQuestion.find({ courseId, lectureId })
      .populate("studentId", "name photoUrl")
      .sort({ createdAt: 1 });
    res.json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Instructor replies to a question
export const replyLectureQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { reply } = req.body;
    if (!reply) {
      return res.status(400).json({ success: false, message: "Reply is required." });
    }
    const updated = await LectureQuestion.findByIdAndUpdate(
      questionId,
      { instructorReply: reply },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Like a question
export const likeLectureQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.id;
    const question = await LectureQuestion.findById(questionId);
    if (!question) return res.status(404).json({ success: false, message: "Question not found" });
    if (question.likes.includes(userId)) {
      return res.status(400).json({ success: false, message: "Already liked" });
    }
    question.likes.push(userId);
    await question.save();
    res.json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Unlike a question
export const unlikeLectureQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.id;
    const question = await LectureQuestion.findById(questionId);
    if (!question) return res.status(404).json({ success: false, message: "Question not found" });
    question.likes = question.likes.filter(id => id.toString() !== userId);
    await question.save();
    res.json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a reply to a question (threaded reply)
export const addReplyToLectureQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { text } = req.body;
    const userId = req.id;
    if (!text) return res.status(400).json({ success: false, message: "Reply text is required" });
    const question = await LectureQuestion.findById(questionId);
    if (!question) return res.status(404).json({ success: false, message: "Question not found" });
    question.replies.push({ userId, text, createdAt: new Date() });
    await question.save();
    res.json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
