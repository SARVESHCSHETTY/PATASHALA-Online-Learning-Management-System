import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './models/user.model.js'; 

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const exists = await User.findOne({ email: 'superadmin@lms.com' });
    if (exists) return console.log(' Already exists');

    const hashedPassword = await bcrypt.hash('Admin@1410', 10);
    await User.create({
      name: 'Super Admin',
      email: 'superadmin@lms.com',
      password: hashedPassword,
      role: 'superadmin',
    });

    console.log(' Super admin created');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createSuperAdmin();
