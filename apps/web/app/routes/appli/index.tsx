import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {

}

export default function Index() {
  return "メインだよ";
}
