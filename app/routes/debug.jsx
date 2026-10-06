import { useLoaderData } from "react-router";
import prisma from "../db.server";

export const loader = async () => {
  let dbTest = "not tested";
  try {
    const count = await prisma.session.count();
    dbTest = `DB OK sessions=${count}`;
  } catch (e) {
    dbTest = `DB FAIL: ${String(e?.message || e).slice(0, 500)}`;
  }
  return {
    ok: true,
    apiKeyPreview: (process.env.SHOPIFY_API_KEY || "missing").slice(0, 4),
    secretLen: (process.env.SHOPIFY_API_SECRET || "").trim().length,
    hasScopes: !!process.env.SCOPES,
    scopesPreview: (process.env.SCOPES || "missing").slice(0, 80),
    appUrl: process.env.SHOPIFY_APP_URL || "missing",
    dbHasNeon: (process.env.DATABASE_URL || "").includes("neon.tech"),
    dbTest,
  };
};

export default function Debug() {
  const data = useLoaderData();
  return (
    <div style={{ padding: 20 }}>
      <h1>CartNova Debug</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}