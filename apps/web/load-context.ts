import type { Context } from "hono";
import type { JwtPayloadType } from "./app/auth/jwt";
import type { UserType } from "./app/db/user/getUser";

type Env = {
  Variables: {
    user: UserType;
    jwt: JwtPayloadType;
  }
};

export type GetLoadContextArgs = {
  request: Request;
  context: {
    hono: {
      context: Context<Env>
    },
  }
};

// HonoのコンテキストをRemixに渡す
declare module "react-router" {
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {
    context: GetLoadContextArgs["context"];
    user: UserType;
    jwt: JwtPayloadType;
  }
};

export function getLoadContext(args: GetLoadContextArgs) {
  return {
    context: args.context,
    user: args.context.hono.context.get("user"),
    jwt: args.context.hono.context.get("jwt"),
  };
};
