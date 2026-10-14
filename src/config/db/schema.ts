// this file is used to export the schema for the database
// export * from './schema.sqlite'; // sqlite schema, used when DATABASE_PROVIDER=sqlite or DATABASE_PROVIDER=turso
// export * from './schema.mysql'; // mysql schema, used when DATABASE_PROVIDER=mysql
// export * from './schema.postgres'; // postgres schema, used when DATABASE_PROVIDER=postgresql
//
// NOTE: the active schema must match the runtime database provider.
// The SQLite schema stores timestamp columns as epoch milliseconds, which the
// Postgres driver rejects at runtime (for example the `verification` insert
// performed by auth sign-in), while the Postgres schema emits proper
// `timestamp with time zone` columns. Production runs on Postgres
// (DATABASE_PROVIDER=postgresql) and local dev runs on SQLite, so select the
// schema at runtime instead of hardcoding one dialect.
import { envConfigs } from '@/config';

import * as mysqlSchema from './schema.mysql';
import * as postgresSchema from './schema.postgres';
import * as sqliteSchema from './schema.sqlite';

// Keep the compile-time types aligned with the template default (sqlite) so
// every existing consumer keeps its current types; only the runtime objects
// are swapped to match the database provider.
type TemplateSchema = typeof sqliteSchema;

const schema: TemplateSchema = (
  envConfigs.database_provider === 'postgresql'
    ? postgresSchema
    : envConfigs.database_provider === 'mysql'
      ? mysqlSchema
      : sqliteSchema
) as unknown as TemplateSchema;

export const user = schema.user;
export const session = schema.session;
export const account = schema.account;
export const verification = schema.verification;
export const config = schema.config;
export const taxonomy = schema.taxonomy;
export const post = schema.post;
export const order = schema.order;
export const subscription = schema.subscription;
export const credit = schema.credit;
export const apikey = schema.apikey;
export const role = schema.role;
export const permission = schema.permission;
export const rolePermission = schema.rolePermission;
export const userRole = schema.userRole;
export const aiTask = schema.aiTask;
export const chat = schema.chat;
export const chatMessage = schema.chatMessage;
