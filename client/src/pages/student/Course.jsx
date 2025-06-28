import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";
import { useGetCourseRatingQuery } from "@/features/api/courseApi";

const Course = ({course}) => {
  const { data: ratingData } = useGetCourseRatingQuery(course._id);
  const avg = ratingData?.average || 0;
  const count = ratingData?.count || 0;

  return (
    <Link to={`course-detail/${course._id}`}>  
    <Card className=" bg-white shadow-lg hover:shadow-2xl rounded-lg overflow-hidden dark:bg-gray-800 transform hover:scale-105 transition-all duration-300">
      <div className="relative">
        <img
          src={course.courseThumbnail }
          alt="Course"
          className="w-full h-36 object-cover rounded-t-lg"
        />
      </div>
      <CardContent className="px-5 py-4 space-y-3 " >
        <h1 className="hover:underline font-bold text-lg truncate">{course.courseTitle}</h1>
        <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={course.creator?.photoUrl||"https://github.com/shadcn.png"} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="font-medium text-sm">{course.creator?.name }</h1>
        </div>
        <Badge className="bg-blue-500 text-white text-xs  px-2 py-1 rounded-full">
            {course.courseLevel}
        </Badge>
        </div>
        <div className="flex items-center gap-1 mt-1">
          {[1,2,3,4,5].map(i => (
            <svg key={i} width="18" height="18" fill={i <= Math.round(avg) ? '#facc15' : '#e5e7eb'} viewBox="0 0 20 20"><polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,18.99 10,15.27 4.18,18.99 6,12.14 0.49,7.64 7.41,7.36" /></svg>
          ))}
          <span className="text-xs text-gray-500 ml-1">{avg.toFixed(1)} ({count})</span>
        </div>
        <div className="text-lg font-semibold">
            <span>₹{course.coursePrice}</span>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
};

export default Course;
