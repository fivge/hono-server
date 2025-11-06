import app from "./app";
import { connect } from "./mongo";

const main = async () => {
  await connect();

  Bun.serve({
    fetch: app.fetch,
    port: 3000,
  });

  console.log(`Server running on http://localhost:3000`);
};

main();
