import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { useParams, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PurchaseCourseProtectedRoute = ({children}) => {
    const {courseId} = useParams();
    const {data} = useGetCourseDetailWithStatusQuery(courseId, { skip: !courseId });
    const { user } = useSelector((state) => state.auth);

    if (!courseId) return <p>No course selected.</p>;
    const isCreator = user && data?.course?.creator?._id === user._id;
    if (!(data?.purchased || isCreator)) return <Navigate to={`/course-detail/${courseId}`}/>
    return children;
}
export default PurchaseCourseProtectedRoute;