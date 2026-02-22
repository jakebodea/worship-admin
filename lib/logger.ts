import pino from "pino";
import type { NextRequest } from "next/server";

const isProduction = process.env.NODE_ENV === "production";

const baseLogger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  serializers: {
    err: pino.stdSerializers.err,
  },
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "yyyy-mm-dd HH:MM:ss",
          },
        },
      }),
});

function forModule(moduleId: string) {
  return baseLogger.child({ module: moduleId });
}

function withRequest(request: Request | NextRequest) {
  const requestId =
    request.headers.get("x-request-id") ?? crypto.randomUUID();
  const path =
    "nextUrl" in request
      ? request.nextUrl.pathname
      : new URL(request.url).pathname;
  return baseLogger.child({
    path,
    method: request.method,
    requestId,
  });
}

export const logger = Object.assign(baseLogger, {
  for: forModule,
  withRequest,
});

export type Logger = typeof baseLogger;
