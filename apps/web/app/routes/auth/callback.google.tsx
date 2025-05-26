import { redirect } from "react-router";
import type { Route } from "../auth/+types/callback.google";
import { getUser, insertUser } from "~/db/user";
import { jwtVerifier, cognitoTokenUrl , cognitoCallbackParams } from "~/auth";

export async function loader({ request }: Route.LoaderArgs) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    // 認証コードがない場合はログインページにリダイレクト
    return redirect("/login");
  };

  try {
    // Cognitoトークンエンドポイントに認証コードを送信してトークンを取得
    const response = await fetch(cognitoTokenUrl, cognitoCallbackParams(code));

    if (!response.ok) {
      throw new Error(`Token request failed: ${response.statusText}`);
    }

    const tokens = await response.json();
    const headers = new Headers();

    // JWTトークンからユーザデータをDBに登録
    const jwtPayload = await jwtVerifier(tokens.id_token)

    const user = await getUser({email: jwtPayload.email as string});
    if (!user) {
      await insertUser({
        email: jwtPayload.email,
        thumbnailUrl: jwtPayload.picture,
        providerUsername: jwtPayload["cognito:username"],
      });
    }
    
    // アクセストークンをHTTPOnlyクッキーとして設定
    headers.append(
      "Set-Cookie",
      `access_token=${tokens.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${tokens.expires_in}`
    );
    
    // リフレッシュトークンをHTTPOnlyクッキーとして設定 (存在する場合)
    if (tokens.refresh_token) {
      headers.append(
        "Set-Cookie",
        `refresh_token=${tokens.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`
      );
    }
    
    // IDトークンをHTTPOnlyクッキーとして設定
    headers.append(
      "Set-Cookie",
      `id_token=${tokens.id_token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${tokens.expires_in}`
    );

    // ホームページにリダイレクト
    return redirect("/appli/", { headers });
  } catch (error) {
    console.error("Authentication error:", error);
    // エラーメッセージを表示して、再度ログインページにリダイレクト
    return redirect("/login?error=authentication_failed");
  }
};