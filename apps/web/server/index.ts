import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { jwtVerifier, JwtPayload } from '../auth/jwt';


const app = new Hono();

app.use<{ Variables: { jwt: JwtPayload }}>(async (c, next) => {
  // トークンの取得
  const token = getCookie(c, "id_token");
  if (!token) return c.redirect("/login");

  // トークンの検証
  await jwtVerifier.hydrate();
  const jwtPayload = await jwtVerifier.verify(token);
  c.set("jwt", jwtPayload);

  await next();
  c.header("X-Powered-By", "React Router and Hono");
});

export default app;