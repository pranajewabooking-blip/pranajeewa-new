import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { assertEnv, env } from "./config/env.js";

const start = async () => {
  assertEnv();
  await connectDB();

  app.listen(env.port, () => {
    console.log(`Pranajeewa API running on port ${env.port}`);
  });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
