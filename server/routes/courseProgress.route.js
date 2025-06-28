import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCourseProgress, markAsCompleted, markAsInCompleted, updateLectureProgress, askLectureQuestion, getLectureQuestions, replyLectureQuestion, likeLectureQuestion, unlikeLectureQuestion, addReplyToLectureQuestion } from "../controllers/courseProgress.controller.js";

const router = express.Router()

router.post('/question', isAuthenticated, askLectureQuestion);
router.get('/questions', isAuthenticated, getLectureQuestions);
router.patch('/question/:questionId/reply', isAuthenticated, replyLectureQuestion);
router.post('/question/:questionId/like', isAuthenticated, likeLectureQuestion);
router.post('/question/:questionId/unlike', isAuthenticated, unlikeLectureQuestion);
router.post('/question/:questionId/reply-threaded', isAuthenticated, addReplyToLectureQuestion);

router.route("/:courseId").get(isAuthenticated, getCourseProgress);
router.route("/:courseId/lecture/:lectureId/view").post(isAuthenticated, updateLectureProgress);
router.route("/:courseId/complete").post(isAuthenticated, markAsCompleted);
router.route("/:courseId/incomplete").post(isAuthenticated, markAsInCompleted);

export default router;