import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { billing } = await authenticate.admin(request);
  const url = new URL(request.url);
  const plan = url.searchParams.get("plan") || "Starter";
  const valid = ["Starter", "ProfitKit"];
  const selected = valid.includes(plan) ? plan : "Starter";

  throw await billing.request({
    plan: selected,
    isTest: true,
  });
};

export default function Billing() {
  return null;
}