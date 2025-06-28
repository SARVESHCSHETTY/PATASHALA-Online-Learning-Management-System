import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetCourseProgressQuery } from '@/features/api/courseProgressApi';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

const InstructorCourseView = () => {
  const params = useParams();
  const courseId = params.courseId;
  const { data, isLoading, isError } = useGetCourseProgressQuery(courseId);
  const [currentLecture, setCurrentLecture] = useState(null);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load course details</p>;

  const { courseDetails } = data.data;
  const { courseTitle } = courseDetails;
  const initialLecture = currentLecture || (courseDetails.lectures && courseDetails.lectures[0]);

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 mt-5">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseTitle}</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Video section */}
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <div>
            <video
              src={currentLecture?.videoUrl || initialLecture.videoUrl}
              controls
              className="w-full h-auto md:rounded-lg"
            />
          </div>
          <div className="mt-2 ">
            <h3 className="font-medium text-lg">
              {`Lecture ${
                courseDetails.lectures.findIndex(
                  (lec) =>
                    lec._id === (currentLecture?._id || initialLecture._id)
                ) + 1
              } : ${
                currentLecture?.lectureTitle || initialLecture.lectureTitle
              }`}
            </h3>
          </div>
        </div>
        {/* Lecture Sidebar */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lecture</h2>
          <div className="flex-1 overflow-y-auto">
            {courseDetails?.lectures.map((lecture) => (
              <Card
                key={lecture._id}
                className={`mb-3 hover:cursor-pointer transition transform ${
                  lecture._id === (currentLecture?._id || initialLecture._id)
                    ? "bg-gray-200 dark:dark:bg-gray-800"
                    : ""
                } `}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <span>
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mr-2" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </span>
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {lecture.lectureTitle}
                      </CardTitle>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorCourseView; 