import { Hono } from "hono";
import { authMiddleware } from "./middleware/authMiddleware";

const app = new Hono();

app.use("/", authMiddleware, async (c, next) => {
  await next();
  c.header("X-Powered-By", "AuthMiddeleware");
});

app.use("/login", async (c, next) => {
  await next();
  c.header("X-Powered-By", "NoAuthMiddeleware");
});

export default app;