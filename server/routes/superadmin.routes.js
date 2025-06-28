import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { isSuperAdmin } from '../middlewares/isSuperAdmin.js';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getInstructorDashboard,
  getStudentDashboard,
} from '../controllers/superadmin.controller.js';

const router = express.Router();

// These routes are protected
router.use(isAuthenticated, isSuperAdmin);

// GET all users
router.get('/users', getAllUsers);

// PUT update user role
router.put('/users/:id/role', updateUserRole);

// DELETE user
router.delete('/users/:id', deleteUser);

// Add these routes after router.use(isAuthenticated, isSuperAdmin);
router.get('/instructor/:id/dashboard', getInstructorDashboard);
router.get('/student/:id/dashboard', getStudentDashboard);

export default router;
