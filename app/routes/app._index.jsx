import { useLoaderData } from "react-router";
import { useState } from "react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  return { shop: session.shop, currentPlan: "Free (Manual)" };
};

export default function Index() {
  const { shop, currentPlan } = useLoaderData();
  const [saved, setSaved] = useState(false);
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
        <h2>Upgrade to $29/mo - Manual for now</h2>
        <p>Automatic billing coming soon. Chat to activate now.</p>
        <a
          href="https://wa.me/2340000000000?text=Hi%20CartNova%20I%20want%20Profit%20Kit%20$29"
          target="_blank"
          style={{ display: "inline-block", background: "#000", color: "#fff", padding: "10px 16px", borderRadius: 8, textDecoration: "none" }}
        >
          Chat on WhatsApp to Upgrade
        </a>
        <p style={{ fontSize: 12, color: "#666", marginTop: 10 }}>Replace 2340000000000 with YOUR WhatsApp number later.</p>
      </div>
    </div>
  );
}