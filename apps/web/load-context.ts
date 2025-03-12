import type { Context } from "hono";
import type { JwtPayloadType } from "./auth/jwt";

type Env = {
  Variables: {
    jwt: JwtPayloadType
  }
};

export type GetLoadContextArgs = {
  context: {
    hono: {
      context: Context<Env>
    },
    request: Request
  }
};

// JWTを補完する
type jwtComplement = {
  email: string;
};

// HonoのコンテキストをRemixに渡す
declare module "react-router" {
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {
    jwt: JwtPayloadType & jwtComplement;
  }
};

export function getLoadContext(args: GetLoadContextArgs) {
  return {
    context: args.context,
    jwt: args.context.hono.context.get("jwt")
  };
};

