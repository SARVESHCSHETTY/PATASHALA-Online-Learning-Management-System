import { User } from '../models/user.model.js';
import { Course } from '../models/course.model.js';
import { CoursePurchase } from '../models/coursePurchase.model.js';

export const getAllUsers = async (req, res) => {
  const users = await User.find({}, '-password');
  res.json(users);
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ['student', 'instructor', 'superadmin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Prevent changing role of super admin users
  if (user.role === 'superadmin') {
    return res.status(403).json({ message: 'Cannot change role of Super Admin users' });
  }

  user.role = role;
  await user.save();
  res.json({ message: 'Role updated successfully' });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Prevent deletion of super admin users
  if (user.role === 'superadmin') {
    return res.status(403).json({ message: 'Cannot delete Super Admin users' });
  }

  await User.findByIdAndDelete(id);
  res.json({ message: 'User deleted successfully' });
};

export const getInstructorDashboard = async (req, res) => {
  try {
    const instructorId = req.params.id;
    // Get all courses created by this instructor
    const courses = await Course.find({ creator: instructorId });
    // For each course, get enrolled students count and revenue
    const courseStats = await Promise.all(
      courses.map(async (course) => {
        const purchases = await CoursePurchase.find({
          courseId: course._id,
          status: "completed",
        });
        const enrolledCount = purchases.length;
        const revenue = purchases.reduce((sum, p) => sum + p.amount, 0);

        return {
          courseId: course._id,
          courseTitle: course.courseTitle,
          enrolledCount,
          revenue,
        };
      })
    );
    // Total revenue for instructor
    const totalRevenue = courseStats.reduce((sum, c) => sum + c.revenue, 0);
    res.json({
      courses: courseStats,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch instructor dashboard', error: err.message });
  }
};

export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.params.id;
    // Find all purchases by this student
    const purchases = await CoursePurchase.find({ userId: studentId }).populate(
      "courseId"
    );
    const purchasedCourses = purchases.map((p) => ({
      courseId: p.courseId._id,
      courseTitle: p.courseId.courseTitle,
      amount: p.amount,
      purchaseDate: p.createdAt,
    }));
    const totalSpent = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);
    res.json({
      purchasedCourses,
      totalSpent,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch student dashboard", error: err.message });
  }
};
