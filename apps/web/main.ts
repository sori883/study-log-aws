import { serveStatic } from "@hono/node-server/serve-static";
import handle from "hono-react-router-adapter/node";
import * as build from "./build/server";
import { getLoadContext } from "./load-context";
import server from "./server";
import { handle as lambdaHandle } from "hono/aws-lambda";

server.use(
  serveStatic({
    root: "./build/client",
  })
);

// Lambdaのエントリーポイント
const reactRouterHandler = handle(build, server, { getLoadContext });
export const handler = lambdaHandle(reactRouterHandler);