FROM node:20-slim AS base
ENV PNPM_HOME="/tmp/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm
WORKDIR /app

# 依存関係のインストールに必要なパッケージファイルをコピー
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY pnpm-workspace.yaml ./

# Webアプリのpackage.jsonをコピー
COPY apps/web/package.json ./apps/web/


FROM base AS build
WORKDIR /app

RUN --mount=type=cache,id=pnpm,target=/tmp/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run --filter web build
RUN pnpm --filter web deploy --prod deploy/web

FROM base AS web
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter
COPY --from=build app/deploy/web ./

EXPOSE 8080
CMD [ "pnpm", "start-with-adapter" ]