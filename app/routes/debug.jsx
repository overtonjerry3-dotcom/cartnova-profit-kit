import prisma from "../db.server";

export const loader = async () => {
  let dbTest = "not tested";
  try {
    const count = await prisma.session.count();
    dbTest = `DB OK sessions=${count}`;
  } catch (e) {
    dbTest = `DB FAIL: ${String(e.message || e).slice(0, 300)}`;
  }
  const data = {
    ok: true,
    hasApiKey: !!process.env.SHOPIFY_API_KEY,
    hasSecret: !!process.env.SHOPIFY_API_SECRET,
    appUrl: process.env.SHOPIFY_APP_URL || "missing",
    hasDb: !!process.env.DATABASE_URL,
    dbHasNeon: (process.env.DATABASE_URL || "").includes("neon.tech"),
    dbHasPooler: (process.env.DATABASE_URL || "").includes("pooler"),
    dbTest: dbTest,
  };
  return new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
};

export default function Debug() {
  return <div>Debug route - loader should show JSON</div>;
}