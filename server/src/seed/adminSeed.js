import { Admin } from "../models/Admin.js";
import { connectDB } from "../config/db.js";
import { assertEnv } from "../config/env.js";

const seedAdmin = async () => {
  assertEnv();
  await connectDB();

  const name = process.env.ADMIN_NAME || "Pranajeewa Admin";
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed an admin");
  }

  const existing = await Admin.findOne({ email });

  if (existing) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }

  await Admin.create({ name, email, password });
  console.log(`Admin created: ${email}`);
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
