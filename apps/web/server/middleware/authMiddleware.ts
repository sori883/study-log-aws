import { MiddlewareHandler } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { jwtVerifier, JwtPayloadType } from "../../auth/jwt";
import { getUser, UserType } from "../../app/db/user/getUser";

export type TokensType = {
  id_token: string;
  access_token: string;
  expires_in: number;
  token_type: string;
}

export const authMiddleware: MiddlewareHandler<{
  Variables: {
    jwt: JwtPayloadType;
    user: UserType;
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
    // refresh_tokenを使用してid_tokenを更新するためのエンドポイント
    const tokenEndpoint = `https://${process.env.COGNITO_DOMAIN}.auth.${process.env.AWS_REGION}.amazoncognito.com/oauth2/token`;

    // refresh_tokenを使用してid_tokenを更新す
    try {
      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: process.env.COGNITO_CLIENT_ID!,
          client_secret: process.env.COGNITO_CLIENT_SECRET!,
          redirect_uri: process.env.AUTH_CALLBACK_URL!,
          refresh_token,
        })
      });
  
      // レスポンスエラー
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
    await jwtVerifier.hydrate();
    const jwtPayload = await jwtVerifier.verify(id_token);
    // jwtPayloadをRemixに渡すためにコンテキストに詰める
    c.set("jwt", jwtPayload);
    // ユーザ情報を取得して、usernameが未設定だったらリダイレクト
    const user = await getUser({email: jwtPayload.email as string})
    if (!user?.username) {
      return c.redirect("/auth/init");
    }
    c.set("user", user);
  };


  await next();
};