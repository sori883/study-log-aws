import { LoaderFunctionArgs, redirect } from "react-router";



export async function loader({ request, context }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    // 認証コードがない場合はログインページにリダイレクト
    return redirect("/login");
  };

  try {
    // Cognitoトークンエンドポイントに認証コードを送信してトークンを取得
    const tokenEndpoint = `https://${process.env.COGNITO_DOMAIN}.auth.${process.env.AWS_REGION}.amazoncognito.com/oauth2/token`;
  // Basic認証のための認証情報を作成
  const credentials = Buffer.from(`${process.env.COGNITO_CLIENT_ID}:${process.env.COGNITO_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${credentials}`
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.COGNITO_CLIENT_ID!,
      code,
      redirect_uri: process.env.AUTH_CALLBACK_URL!
    })
  });

  if (!response.ok) {
    throw new Error(`Token request failed: ${response.statusText}`);
  }

  const tokens = await response.json();
  const headers = new Headers();
    
    // アクセストークンをHTTPOnlyクッキーとして設定
    headers.append(
      "Set-Cookie",
      `access_token=${tokens.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${tokens.expires_in}`
    );
    
    // リフレッシュトークンをHTTPOnlyクッキーとして設定 (存在する場合)
    if (tokens.refresh_token) {
      headers.append(
        "Set-Cookie",
        `refresh_token=${tokens.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`
      );
    }
    
    // IDトークンをHTTPOnlyクッキーとして設定
    headers.append(
      "Set-Cookie",
      `id_token=${tokens.id_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${tokens.expires_in}`
    );

    // ホームページにリダイレクト
    return redirect("/", {
      headers
    });

  } catch (error) {
    console.error("Authentication error:", error);
    // エラーメッセージを表示して、再度ログインページにリダイレクト
    return redirect("/login?error=authentication_failed");
  }

};