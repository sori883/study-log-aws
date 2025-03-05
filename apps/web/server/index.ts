import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { jwtVerifier } from '../auth/jwt';

const app = new Hono();

app.use(async (c, next) => {
  const token = getCookie(c, "id_token");
  if (!token) return c.redirect("/login");

  await jwtVerifier.hydrate();
  const jwtPayload = await jwtVerifier.verify(token);

  await next();
  c.header("X-Powered-By", "React Router and Hono");
});

export default app;