import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetInstructorDashboardQuery, useGetStudentDashboardQuery } from "@/features/superadminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, ShoppingCart, Users, BookOpen } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SuperAdminUserDashboard = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

  if (role === "instructor") {
    return <InstructorDashboard id={id} />;
  } else if (role === "student") {
    return <StudentDashboard id={id} />;
  } else {
    return <div className="p-8">Unknown user role.</div>;
  }
};

const InstructorDashboard = ({ id }) => {
  const { data, isLoading, isError } = useGetInstructorDashboardQuery(id);
  
  if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>
  if (isError) return <div className="text-red-500 text-center py-10">Failed to load instructor dashboard.</div>;

  const { courses: rawCourses = [], totalRevenue = 0 } = data || {};

  const courses = rawCourses.map(course => ({
    ...course,
    name: course.courseTitle // for recharts labels
  }));

  const totalSales = courses.reduce((sum, course) => sum + course.enrolledCount, 0);
  const totalStudents = totalSales; 

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

  return (
    <div className="container mx-auto p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Instructor's Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-500">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Total Sales</h3>
          <p className="text-3xl font-bold text-blue-500">{totalSales}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Total Students</h3>
          <p className="text-3xl font-bold text-purple-500">{totalStudents}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Course Revenue</h2>
          {courses.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courses} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" name="Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-full text-gray-500">No sales data to display.</div>}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Student Distribution</h2>
          {courses.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={courses} dataKey="enrolledCount" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {courses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-full text-gray-500">No student data to display.</div>}
        </div>
      </div>

      {/* Course Details Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Course Performance Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Enrolled Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course.courseId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{course.courseTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{course.enrolledCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">₹{course.revenue.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">This instructor has no course sales.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StudentDashboard = ({ id }) => {
  const { data, isLoading, isError } = useGetStudentDashboardQuery(id);

  if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
  if (isError) return <div className="text-red-500 text-center py-10">Failed to load student dashboard.</div>;

  const { purchasedCourses = [], totalSpent = 0 } = data || {};

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Student's Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</CardTitle>
            <IndianRupee className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">₹{totalSpent.toLocaleString()}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total amount spent on courses</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Courses Purchased</CardTitle>
            <BookOpen className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{purchasedCourses.length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total number of courses enrolled in</p>
          </CardContent>
        </Card>
      </div>

      {/* Purchased Courses Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">Purchased Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {purchasedCourses.length > 0 ? (
                  purchasedCourses.map((course) => (
                    <tr key={course.courseId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{course.courseTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">₹{course.amount.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">No courses purchased yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </div>
    </div>
  );
};

export default SuperAdminUserDashboard; 