import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;

  const [CreateLecture, { data, isLoading, isSuccess, error }] =
    useCreateLectureMutation();

  const {
    data: lecturedata,
    isLoading: lectureLoading,
    isError: lectureError,
    refetch,
} = useGetCourseLectureQuery( {courseId});

  const createLectureHandler = async () => {
    await CreateLecture({ lectureTitle, courseId });
  };

  useEffect(() => {
    if (isSuccess) {
       refetch(); 
      toast.success(data.message);
       
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  return (
    <div>
      <div className="flex-1 mx-10">
        <div className="mb-4">
          <h1 className="font-bold text-xl">
            Lets add Lecture,add some basic details for your new lecture
          </h1>
          <p className="text-sm">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore nam
            delectus ab eveniet laudantium fugit quia ipsa esse? Ex ratione,
            voluptas tenetur temporibus cum dolorem iste possimus accusantium
            atque sint.
          </p>
          <div>
            <div className="space-y-4 ">
              <Label>Title</Label>
              <Input
                type="text"
                placeholder="Your Lecture Title "
                value={lectureTitle}
                onChange={(e) => setLectureTitle(e.target.value)}
                className="w-[400px] border-gray-300 dark:border-gray-700"
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/course/${courseId}`)}
              >
                Back to course
              </Button>
              <Button disabled={isLoading} onClick={createLectureHandler}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please Wait
                  </>
                ) : (
                  "Create Lecture"
                )}
              </Button>
            </div>
            <div className="mt-10">
              {lectureLoading ? (
                <p>Loading lectures....</p>
              ) : lectureError ? (
                <p>Failed to load lectures.</p>
              ) : lecturedata.lectures.length === 0 ? (
                <p>No lectures available</p>
              ) : (
                lecturedata.lectures.map((lecture, index) => (
                  <Lecture key={lecture._id} lecture={lecture} index={index} courseId={courseId}/>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
