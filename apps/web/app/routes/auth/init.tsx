import type { Route } from "./+types/init";
import cookie from "cookie";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  // Honoでリダイレクトしているので、Cookieからid_tokenを取得する
  const id_token = cookie.parse(request.headers.get("Cookie") || "").id_token;
}

export default function Init() {
  return <div>init</div>;
}
