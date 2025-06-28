import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import HeroSection from "./pages/student/HeroSection";
import MainLayout from "./layout/MainLayout";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/course/CourseTable";
import Courses from "./pages/student/Courses";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetail from "./pages/student/CourseDetail";
import CourseProgress from "./pages/student/CourseProgress";
import SearchPage from "./pages/student/SearchPage";
import ContactUs from "./pages/ContactUs"
import {
  AdminRoute,
  AuthenticatedUser,
  ProtectedRoute,
} from "./components/ProtectedRoutes";
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";
import { ThemeProvider } from "./components/TheamProvider";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Toaster } from "./components/ui/toaster";
import InstructorCourseView from "./pages/student/InstructorCourseView";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import { SuperAdminRoute } from "./components/ProtectedRoutes"; // You'll create this guard below
import SuperAdminUserDashboard from "./pages/SuperAdminUserDashboard";



const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path:"/contactUs",
        element: (
            <ContactUs/>
        ),

      },
      {
        path:"/forgotPassword",
        element: (
            <ForgotPassword/>
        ),
      },
      {
        path:"/resetPassword",
        element: (
            <ResetPassword/>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthenticatedUser>
            <Login />
          </AuthenticatedUser>
        ),
      },
      {
        path: "/my-learning",
        element: (
          <ProtectedRoute>
            <MyLearning />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-learning/course-detail/:courseId",
        element: <CourseDetail />,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/course-detail/:courseId",
        element: <CourseDetail />,
      },
      {
        path: "/course/search",
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "course-detail/:courseId",
        element: (
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "course-detail",
        element: <div style={{padding:40, textAlign:'center', color:'red', fontWeight:'bold'}}>No course selected. Please select a course.</div>,
      },
      {
        path: "course-progress/:courseId",
        element: (
          <ProtectedRoute>
            <PurchaseCourseProtectedRoute>
              <CourseProgress />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "instructor-course-view/:courseId",
        element: (
          <ProtectedRoute>
            <InstructorCourseView />
          </ProtectedRoute>
        ),
      },
      // admin routes start from here
      {
        path: "/admin",
        element: (
          <AdminRoute>
            <Sidebar />
          </AdminRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "course",
            element: <CourseTable />,
          },
          {
            path: "course/create",
            element: <AddCourse />,
          },
          {
            path: "course/:courseId",
            element: <EditCourse />,
          },
          {
            path: "course/:courseId/lecture",
            element: <CreateLecture />,
          },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture />,
          },
        ],
      },
      {
        path: "/superadmin/dashboard",
        element: (
          <SuperAdminRoute>
            <SuperAdminDashboard />
          </SuperAdminRoute>
        ),
      },
      {
        path: "/superadmin/user-dashboard/:id",
        element: (
          <SuperAdminUserDashboard />
        ),
      }
      
    ],
  },
]);

function App() {
  return (
    <main>
      <ThemeProvider>
      
      <RouterProvider router={appRouter} />
      <Toaster />
      </ThemeProvider>
    </main>
  );
}

export default App;
