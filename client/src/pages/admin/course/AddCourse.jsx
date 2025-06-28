import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {

  const [courseTitle,setCourseTitle]=useState("");
  const[category,setCategory]=useState("");

  const [createCourse,{data,isLoading,error,isSuccess}] = useCreateCourseMutation();
  const navigate = useNavigate();
 
  const getSelectedCategory=(value) =>{
    setCategory(value);
  }
  const createCourseHandler = async () => {
  await createCourse({ courseTitle, category });
};

  //for dispalying message
 useEffect(() => {
  if (isSuccess) {
    toast.success(data?.message || "Course Created.");
    navigate("/admin/course");
  }
  if (error) {
    toast.error("Failed to create course. Please check server logs.");
  }
}, [isSuccess, error, data]);


  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Lets add course,add some basic details for your new course
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
              placeholder="Course Title"
              value={courseTitle}
              onChange={(e) =>setCourseTitle(e.target.value)}
              className="w-[400px] border-gray-300 dark:border-gray-700"
            />
            <Label>Category</Label>
            <Select onValueChange={getSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="Next JS">Next JS</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Frontend Development">
                    Frontend Development
                  </SelectItem>
                  <SelectItem value="Fullstack Development">
                    Fullstack Development
                  </SelectItem>
                  <SelectItem value="MERN Stack Development">
                    MERN Stack Development
                  </SelectItem>
                  <SelectItem value="Javascript">Javascript</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="Docker">Docker</SelectItem>
                  <SelectItem value="MongoDB">MongoDB</SelectItem>
                  <SelectItem value="HTML">HTML</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 pt-5">
            <Button variant="outline" onClick={() => navigate("/admin/course")}>
              Back
            </Button>
            <Button disabled={isLoading} onClick={createCourseHandler}>
              {
                isLoading ?(
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  Please Wait
                  </>
                ) : "Create"
              }
              </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddCourse;
