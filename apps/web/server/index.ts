import { Hono } from "hono";
import { requiredLogin } from "./middleware/auth/requiredLogin";
import { isInitLogin } from "./middleware/auth/isInitLogin";
import { unnecessaryLogin } from "./middleware/auth/unnecessaryLogin";

const app = new Hono();

app.use("/appli/*", requiredLogin,  async (c, next) => {
  await next();
});

app.use("/auth/login", unnecessaryLogin, async (c, next) => {
  await next();
});

app.use("/auth/init", isInitLogin,  async (c, next) => {
  await next();
});

export default app;