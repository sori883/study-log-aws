import { Form, redirect } from "react-router";
import type { Route } from "../auth/+types/login";
import { cognitoAuthUrl, cognitoQueryParams } from "~/auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const action = async ({ request, context }: Route.ActionArgs) => {
    // Google認証ページにリダイレクト
    return redirect(`${cognitoAuthUrl}?${cognitoQueryParams.toString()}`);
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
