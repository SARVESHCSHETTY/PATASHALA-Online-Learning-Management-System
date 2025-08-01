import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLecture, getCreatorCourses, getLectureById, getPublishedCourse, removeLecture, searchCourse, togglePublishCourse, getCourseEnrollmentStats, rateCourse, getCourseRating } from '../controllers/course.controller.js';
import upload from "../utils/multer.js"

const router = express.Router();
router.route("/").post(isAuthenticated,createCourse) ;
router.route("/search").get(isAuthenticated,searchCourse) ; // Assuming this is for searching published courses
router.route("/published-courses").get(getPublishedCourse) ;
router.route("/").get(isAuthenticated,getCreatorCourses) ;
router.route("/:courseId").put(isAuthenticated,upload.single("courseThumbnail"),editCourse) ;
router.route("/:courseId").get(isAuthenticated,getCourseById) ;
router.route("/:courseId/lecture").post(isAuthenticated,createLecture) ;
router.route("/:courseId/lecture").get(isAuthenticated,getCourseLecture) ;
router.route("/:courseId/lecture/:lectureId").put(isAuthenticated,editLecture) ;
router.route("/lecture/:lectureId").delete(isAuthenticated,removeLecture) ;
router.route("/lecture/:lectureId").get(isAuthenticated,getLectureById) ;
router.route("/:courseId/publish").patch(isAuthenticated, togglePublishCourse);
router.get('/:id/enrollment-stats', getCourseEnrollmentStats);
router.post('/:courseId/rate', isAuthenticated, rateCourse);
router.get('/:courseId/rating', getCourseRating);

export default router;