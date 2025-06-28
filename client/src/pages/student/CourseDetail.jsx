import BuyCourseButton from "@/components/BuyCourseButton";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useRateCourseMutation, useGetCourseRatingQuery } from "@/features/api/courseApi";
import { toast } from "sonner";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId, {
    skip: !courseId,
  });
  const { data: ratingData, refetch: refetchRating } = useGetCourseRatingQuery(courseId, {
    skip: !courseId,
  });

  const [rateCourse] = useRateCourseMutation();
  const [myRating, setMyRating] = useState(0);

  const course = data?.course;
  const purchased = data?.purchased;

  const avg = ratingData?.average || 0;
  const count = ratingData?.count || 0;
  const isCreator = user && course && user._id === course?.creator?._id;

  // ✅ Always run effect (never conditionally call hooks)
  useEffect(() => {
    if (purchased && course && user) {
      const existing = course.ratings?.find(r => r.userId === user._id);
      setMyRating(existing ? existing.rating : 0);
    }
  }, [course, user, purchased]);

  const handleRate = async (val) => {
    setMyRating(val);
    await rateCourse({ courseId, rating: val });
    toast.success("Rating submitted!");
    refetchRating();
  };

  const handleContinueCourse = () => {
    navigate(`/course-progress/${courseId}`);
  };

  const enrolledCount = course?.enrolledStudents?.length ?? 'N/A';

  if (!courseId) return <Navigate to="/" replace />;
  if (isLoading) return <h1>Loading...</h1>;
  if (isError || !course) return <h1>Failed to load course details</h1>;

  return (
    <div className="space-y-5">
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2 mt-10">
          <h1 className="font-bold text-2xl md:text-3xl">{course?.courseTitle}</h1>
          <p className="text-base md:text-lg">{course?.subTitle || course?.subtitle || "No subtitle"}</p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course?.creator?.name}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated {course?.createdAt?.split("T")[0]}</p>
          </div>
          <p>
            Students enrolled: {enrolledCount}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: course?.description || "" }}
          />
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course?.lectures?.map((lecture, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span>{purchased ? <PlayCircle size={14} /> : <Lock size={14} />}</span>
                  <p>{lecture.lectureTitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">
                <ReactPlayer
                  width="100%"
                  height="100%"
                  url={course?.lectures?.[0]?.videoUrl}
                  controls
                />
              </div>
              <h1>Lecture title</h1>
              <Separator className="my-2" />
              <h1 className="text-lg md:text-xl font-semibold">Course Price</h1>

              {purchased && (
                <div className="mb-2 flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <svg
                        key={i}
                        width="28"
                        height="28"
                        fill={i <= myRating ? '#facc15' : '#e5e7eb'}
                        viewBox="0 0 20 20"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRate(i)}
                      >
                        <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,18.99 10,15.27 4.18,18.99 6,12.14 0.49,7.64 7.41,7.36" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-500 ml-2">{avg.toFixed(1)} ({count})</span>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">Click to rate this course</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {isCreator ? (
                <Button onClick={handleContinueCourse} className="w-full">View Course</Button>
              ) : purchased ? (
                <Button onClick={handleContinueCourse} className="w-full">Continue Course</Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
