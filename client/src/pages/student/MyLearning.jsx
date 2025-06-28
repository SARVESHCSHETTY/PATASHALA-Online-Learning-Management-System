import React from 'react'
import Course from './Course';
import { useLoadUserQuery } from '@/features/api/authApi';
import { useGetCreatorCourseQuery } from '@/features/api/courseApi';

const MyLearning = () => {
    const { data, isLoading: isUserLoading } = useLoadUserQuery();
    const user = data?.user;
    const isInstructor = user?.role === 'instructor';

    // For instructors, fetch their created courses
    const { data: creatorCoursesData, isLoading: isCoursesLoading } = useGetCreatorCourseQuery(undefined, { skip: !isInstructor });
    const myLearning = isInstructor
        ? creatorCoursesData?.courses || []
        : user?.enrolledCourses || [];

    const loading = isUserLoading || (isInstructor && isCoursesLoading);

    return (
        <div className='max-w-4xl mx-auto my-10 px-4 md:px-0'>
            <h1 className='font-bold text-2xl '>{isInstructor ? 'MY COURSES' : 'MY LEARNING'}</h1>
            <div className='my-5'>
                {
                    loading ? (
                        <MyLearningSkeleton />
                    ) : myLearning.length === 0 ? (<p>{isInstructor ? 'You have not created any courses.' : 'You are not enrolled in any courses.'}</p>) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                            {
                                myLearning.map((course, index) => <Course key={index} course={course} />)
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default MyLearning

const MyLearningSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
            <div
                key={index}
                className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
            ></div>
        ))}
    </div>
);
