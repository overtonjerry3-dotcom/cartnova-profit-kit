import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const plan = url.searchParams.get("plan") || "Starter";

  const plans = {
    Starter: { amount: 9.99, name: "Starter", trialDays: 14 },
    ProfitKit: { amount: 29, name: "ProfitKit", trialDays: 14 },
  };
  const selected = plans[plan] ? plan : "Starter";
  const p = plans[selected];

  const shop = session.shop;
  const shopHandle = shop.replace(".myshopify.com", "");
  const clientId = process.env.SHOPIFY_API_KEY || "";
  const returnUrl = `https://admin.shopify.com/store/${shopHandle}/apps/${clientId}`;

  const response = await admin.graphql(
    `#graphql
    mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $trialDays: Int, $test: Boolean) {
      appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems, trialDays: $trialDays, test: $test) {
        userErrors { field message }
        confirmationUrl
        appSubscription { id name status test }
      }
    }`,
    {
      variables: {
        name: p.name,
        returnUrl: returnUrl,
        trialDays: p.trialDays,
        test: true,
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                price: { amount: p.amount, currencyCode: "USD" },
                interval: "EVERY_30_DAYS",
              },
            },
          },
        ],
      },
    }
  );

  const data = await response.json();
  const confirmationUrl = data?.data?.appSubscriptionCreate?.confirmationUrl;

  if (!confirmationUrl) {
    console.error("BILLING CREATE FAIL", JSON.stringify(data).slice(0, 1000));
    throw new Response("Billing failed, try again.", { status: 500 });
  }

  throw new Response(null, {
    status: 302,
    headers: { Location: confirmationUrl },
  });
};

export default function Billing() {
  return null;
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};