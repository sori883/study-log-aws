import cookie from "cookie";
import { jwtVerifier } from "~/auth";

// CookieからJWTを取得
// リダイレクトした後にCookieからJWTを取得する用途
export const getJwtFromCookie = async (request: Request) => {
  const id_token = cookie.parse(request.headers.get("Cookie") || "").id_token;
  if (!id_token) { return undefined; }

  return await jwtVerifier(id_token)
}