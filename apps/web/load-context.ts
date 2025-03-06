import type { Context } from "hono";
import type { JwtPayloadType } from "./auth/jwt";

type Env = {
  Variables: {
    jwt: JwtPayloadType
  }
};

type GetLoadContextArgs = {
  request: Request
  context: {
    hono: {
      context: Context<Env>
    }
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
  const { context } = args;
  return {
    ...context,
    jwt: context.hono.context.get("jwt")
  };
};