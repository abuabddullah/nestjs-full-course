/**
 * Admin seed script: connect to MongoDB, upsert an admin user with hashed password, and exit.
 */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import appConfig from '../../config/app.config';

import { Role } from '../../user/user.types';
import { User, UserSchema } from 'src/user/schemas/user.schema';

async function run() {
  const { mongoUri } = appConfig();

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '000000';
  const ADMIN_FNAME = process.env.ADMIN_FNAME || 'Admin';
  const ADMIN_LNAME = process.env.ADMIN_LNAME || 'User';

  if (!mongoUri) {
    console.error(
      'Missing MongoDB URI. Set MONGO_URI or configure app.config.ts',
    );
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  const UserModel = mongoose.model(User.name, UserSchema);

  const existing = await UserModel.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`Admin already exists: ${existing.email}`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const saltRounds = 10;
  const hashed = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

  await UserModel.create({
    fname: ADMIN_FNAME,
    lname: ADMIN_LNAME,
    email: ADMIN_EMAIL,
    password: hashed,
    role: Role.Admin,
  });

  console.log(`Admin user created: ${ADMIN_EMAIL}`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(async (err) => {
  console.error('Admin seed failed:', err);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
