import { Redis } from "ioredis";

export interface Session {
  userId?: string;
  Session: any;
}

export type Resolver = (
  parent: any,
  args: any,
  context: { redis: Redis; url: string; session: Session },
  info: any
) => any;

export type GraphqlMiddlewareFunc = (
  resolver: Resolver,
  parent: any,
  args: any,
  context: { redis: Redis; url: string; session: Session },
  info: any
) => any;

export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver;
  };
}
