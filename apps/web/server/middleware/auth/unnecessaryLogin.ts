import { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";

export const unnecessaryLogin: MiddlewareHandler = async (c, next) => {
  // リフレッシュトークンが存在する場合は/appli/にリダイレクトする
  const refresh_token = getCookie(c, "refresh_token");
  if (refresh_token) return c.redirect("/appli/");
  await next();
}