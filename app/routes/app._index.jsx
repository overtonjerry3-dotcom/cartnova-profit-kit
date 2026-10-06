import { useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin, billing, session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const upgrade = url.searchParams.get("upgrade");

  let confirmationUrl = null;

  if (upgrade === "Starter" || upgrade === "ProfitKit") {
    try {
      const plans = {
        Starter: { amount: 9.99, name: "Starter", trialDays: 14 },
        ProfitKit: { amount: 29, name: "ProfitKit", trialDays: 14 },
      };
      const p = plans[upgrade];
      const shop = session.shop;
      const shopHandle = shop.replace(".myshopify.com", "");
      const clientId = (process.env.SHOPIFY_API_KEY || "").trim();
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
      confirmationUrl = data?.data?.appSubscriptionCreate?.confirmationUrl || null;
      if (!confirmationUrl) {
        console.error("BILLING CREATE FAIL", JSON.stringify(data).slice(0, 1000));
      }
    } catch (e) {
      console.error("UPGRADE FAIL", e?.message || e);
    }
  }

  let currentPlan = "Free";
  try {
    const check = await billing.check({
      plans: ["ProfitKit", "Starter"],
      isTest: true,
    });
    if (check?.hasActivePayment) {
      currentPlan = check?.activeSubscriptions?.[0]?.name || "Paid";
    }
  } catch (e) {
  }
  return { shop: session.shop, currentPlan, confirmationUrl };
};

export default function Index() {
  const { shop, currentPlan, confirmationUrl } = useLoaderData();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState("");

  useEffect(() => {
    if (confirmationUrl) {
      window.open(confirmationUrl, "_top");
    }
  }, [confirmationUrl]);

  const upgrade = (plan) => {
    setLoading(plan);
    const params = new URLSearchParams(window.location.search);
    params.set("upgrade", plan);
    window.location.href = `/app?${params.toString()}`;
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto", fontFamily: "system-ui" }}>
      <h1>CartNova - Profit Kit</h1>
      <p>Store: {shop}</p>
      <p style={{ background: "#f3f4f6", padding: 8, borderRadius: 8 }}>
        Current Plan: <b>{currentPlan}</b>
      </p>
      {saved && (
        <div style={{ background: "#d1fae5", padding: 10, borderRadius: 8, marginBottom: 12 }}>
          Settings saved!
        </div>
      )}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 16, background: "#fff" }}>
        <h2>1. Delivery Date Picker - $9 value</h2>
        <p>Calendar on cart. Stop failed deliveries.</p>
        <h2>2. Returns Saver AI - $15 value</h2>
        <p>Auto-answers where is my order 24/7.</p>
        <button
          onClick={() => setSaved(true)}
          style={{ background: "#000", color: "#fff", padding: "10px 16px", borderRadius: 8, border: 0, cursor: "pointer" }}
        >
          Save Settings
        </button>
      </div>
      <div style={{ border: "2px solid #000", borderRadius: 12, padding: 16, background: "#fff" }}>
        <h2>Upgrade to $29/mo</h2>
        <p>Get ALL 3 apps. 14 days free.</p>
        <button
          onClick={() => upgrade("Starter")}
          style={{ padding: "10px 16px", borderRadius: 8, marginRight: 8, border: "1px solid #000", background: "#fff", cursor: "pointer" }}
        >
          {loading === "Starter" ? "Loading..." : "Start $9.99 Starter"}
        </button>
        <button
          onClick={() => upgrade("ProfitKit")}
          style={{ background: "#000", color: "#fff", padding: "10px 16px", borderRadius: 8, border: 0, cursor: "pointer" }}
        >
          {loading === "ProfitKit" ? "Loading..." : "Get Profit Kit $29"}
        </button>
        <p style={{ fontSize: 12, color: "#666", marginTop: 10 }}>Test mode now. No real charge on test store.</p>
      </div>
    </div>
  );
}