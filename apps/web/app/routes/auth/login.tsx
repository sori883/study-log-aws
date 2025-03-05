import { ActionFunctionArgs, Form, redirect } from "react-router";
import type { Route } from "../+types/home";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const action = async ({ request, context }: ActionFunctionArgs) => {
      // Google認証URLを構築
      const cognitoAuthUrl = `https://${process.env.COGNITO_DOMAIN}.auth.${process.env.AWS_REGION}.amazoncognito.com/oauth2/authorize`;
      const queryParams = new URLSearchParams({
        client_id: process.env.COGNITO_CLIENT_ID!,
        response_type: "code",
        scope: "email openid profile",
        redirect_uri: process.env.AUTH_CALLBACK_URL!,
        identity_provider: "Google"
      });

    // Google認証ページにリダイレクト
    return redirect(`${cognitoAuthUrl}?${queryParams.toString()}`);
};

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <Form method="post">
        <button type="submit">Sign In</button>
      </Form>
    </div>
  );
}
