import { MiddlewareHandler } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { getUser } from "~/db/user"
import { cognitoTokenUrl, cognitoRefreshParams, jwtVerifier, JwtPayloadType, TokensType } from "~/auth";

export const isInitLogin: MiddlewareHandler<{
  Variables: {
    jwt: JwtPayloadType;
  };
}> = async (c, next) => {
  // リフレッシュトークンが存在しない場合はloginにリダイレクトする
  const refresh_token = getCookie(c, "refresh_token");
  if (!refresh_token) return c.redirect("/login");

  // トークンの取得
  let tokens: TokensType | undefined = undefined;
  let id_token = getCookie(c, "id_token");

  // id_tokenがない場合はリフレッシュトークンを使用して取得
  if (!id_token) {
    // refresh_tokenを使用してid_tokenを更新す
    try {
      const response = await fetch(cognitoTokenUrl, cognitoRefreshParams(refresh_token));
  
      // トークン更新エラー
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`トークン更新エラー: ${JSON.stringify(errorData)}`);
      };
  
      // Cookieに保存するためにトークン格納
      tokens = await response.json() as TokensType;
      // jwt検証用にid_tokenを保存
      id_token = tokens.id_token;

    } catch (error) {
      console.error("トークン更新中にエラーが発生しました:", error);
      throw error;
    };
  };

  // トークンをクッキーに保存
  // tokensに値があるとき=トークンを再取得しているときだけCookieに保存
  if (tokens) {
    setCookie(c, "id_token", tokens.id_token, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "Strict",
      maxAge: tokens.expires_in
    });
    setCookie(c, "access_token", tokens.access_token, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "Strict",
      maxAge: tokens.expires_in
    });
  };

  if (id_token) {
    const jwtPayload = await jwtVerifier(id_token);
    // ユーザ情報を取得して、usernameが設定済みだったらアプリ画面にリダイレクト
    const user = await getUser({email: jwtPayload.email})
    if (user?.username) {
      return c.redirect("/appli/");
    }
  };

  await next();
}