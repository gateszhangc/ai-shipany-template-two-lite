import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { getAuth } from '@/core/auth';
import * as activeSchema from '@/config/db/schema';
import * as pgSchema from '@/config/db/schema.postgres';
import * as sqliteSchema from '@/config/db/schema.sqlite';
import { envConfigs } from '@/config';
import { db } from '@/core/db';
import { getAllConfigs } from '@/shared/models/config';

export const dynamic = 'force-dynamic';

// TEMPORARY production diagnostic; removed right after use.
export async function GET() {
  const out: Record<string, unknown> = {
    provider: envConfigs.database_provider,
    hasUrl: Boolean(envConfigs.database_url),
    url: String(envConfigs.database_url || '')
      .replace(/\/\/[^@]*@/, '//***@')
      .slice(0, 90),
    dbSchema: envConfigs.db_schema,
    schemaFile: envConfigs.db_schema_file,
    authUrl: envConfigs.auth_url,
    schemaDialect:
      (activeSchema as any).user === (pgSchema as any).user
        ? 'postgres'
        : (activeSchema as any).user === (sqliteSchema as any).user
          ? 'sqlite'
          : 'unknown',
  };

  try {
    const res: any = await db().execute(
      sql`select table_name from information_schema.tables where table_schema = 'public' order by table_name limit 80`
    );
    const rows = Array.isArray(res) ? res : (res?.rows ?? []);
    out.tables = rows.map((r: any) => r.table_name);
  } catch (e) {
    out.tablesError = String(e).slice(0, 300);
  }

  try {
    const cols: any = await db().execute(
      sql`select column_name, data_type from information_schema.columns where table_schema = 'public' and table_name = 'verification' order by ordinal_position`
    );
    const rows = Array.isArray(cols) ? cols : (cols?.rows ?? []);
    out.verificationColumns = rows.map((r: any) => `${r.column_name}:${r.data_type}`);
  } catch (e) {
    out.columnsError = String(e).slice(0, 300);
  }

  try {
    const configs = await getAllConfigs();
    out.configsOk = true;
    out.hasGoogle = Boolean((configs as any).google_client_id);
  } catch (e) {
    out.configsError = String(e).slice(0, 300);
  }

  try {
    const auth = await getAuth();
    const result: any = await auth.api.signInSocial({
      body: { provider: 'google', callbackURL: '/' },
    });
    out.signInOk = true;
    out.signInUrl = String(result?.url || '').slice(0, 110);
  } catch (e: any) {
    out.signInOk = false;
    out.signInError = String(e?.body?.message ?? e?.message ?? e).slice(0, 600);
  }

  return NextResponse.json(out);
}
