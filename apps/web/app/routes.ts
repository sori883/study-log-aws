import { type RouteConfig, index, route } from "@react-router/dev/routes";

// see: https://reactrouter.com/start/framework/routing

export default [
  index("routes/home.tsx"),
  route("login", "routes/auth/login.tsx"),
  route("auth/google/callback", "routes/auth/callback.google.tsx"),
  route("auth/init", "routes/auth/init.tsx"),
] satisfies RouteConfig;
