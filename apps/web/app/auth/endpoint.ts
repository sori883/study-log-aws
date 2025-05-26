// 認証用エンドポイント
export const cognitoAuthUrl = `https://${process.env.COGNITO_DOMAIN}.auth.${process.env.AWS_REGION}.amazoncognito.com/oauth2/authorize`;
export const cognitoTokenUrl = `https://${process.env.COGNITO_DOMAIN}.auth.${process.env.AWS_REGION}.amazoncognito.com/oauth2/token`;

// ログイン用パラメータを設定
export const cognitoQueryParams = new URLSearchParams({
  client_id: process.env.COGNITO_CLIENT_ID!,
  response_type: "code",
  scope: "email openid profile",
  redirect_uri: process.env.AUTH_CALLBACK_URL!,
  identity_provider: "Google"
});
// コールバック用パラメータ
export const cognitoCallbackParams = (code: string) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.COGNITO_CLIENT_ID!,
    client_secret: process.env.COGNITO_CLIENT_SECRET!,
    code,
    redirect_uri: process.env.AUTH_CALLBACK_URL!
  })
});
// リフレッシュ用パラメータ
export const cognitoRefreshParams = (refresh_token: string) => ({
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