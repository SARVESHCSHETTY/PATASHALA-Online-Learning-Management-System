import { useGetInstructorPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, } from 'recharts';

const Dashboard = () => {
  const { data, isError, isLoading } = useGetInstructorPurchasedCoursesQuery();

  if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>
  if (isError) return <div className="text-red-500 text-center py-10">Failed to load dashboard data.</div>

  const { purchasedCourse = [] } = data || {};
  
  const totalRevenue = purchasedCourse.reduce((acc, element) => acc + (element.amount || 0), 0);
  const totalSales = purchasedCourse.length;
  
  const courseData = purchasedCourse.reduce((acc, purchase) => {
    const courseId = purchase.courseId._id;
    if (!acc[courseId]) {
      acc[courseId] = {
        name: purchase.courseId.courseTitle, // Use 'name' for chart labels
        ...purchase.courseId,
        enrolledStudents: 0,
        revenue: 0,
      };
    }
    acc[courseId].enrolledStudents += 1;
    acc[courseId].revenue += purchase.amount || 0;
    return acc;
  }, {});

  const courses = Object.values(courseData);
  const totalStudents = new Set(purchasedCourse.map(p => p.userId.toString())).size;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

  return (
    <div className="container mx-auto p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Instructor Dashboard</h1>
      
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
        {/* Revenue Bar Chart */}
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
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">No sales data to display.</div>
          )}
        </div>

        {/* Students Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Student Distribution</h2>
          {courses.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={courses} dataKey="enrolledStudents" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {courses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">No student data to display.</div>
          )}
        </div>
      </div>

      {/* Course Details Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Course Sales Details</h2>
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
                  <tr key={course._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{course.courseTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{course.enrolledStudents}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">₹{course.revenue.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No courses sold yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
