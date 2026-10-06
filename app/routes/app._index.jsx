import { useLoaderData } from "react-router";
import { useState } from "react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  return { shop: session.shop };
};

export default function Index() {
  const { shop } = useLoaderData();
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto", fontFamily: "system-ui" }}>
      <h1>CartNova - Profit Kit</h1>
      <p>Store: {shop}</p>
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
        <button style={{ padding: "10px 16px", borderRadius: 8, marginRight: 8 }}>Start $9.99 Starter</button>
        <button style={{ background: "#000", color: "#fff", padding: "10px 16px", borderRadius: 8, border: 0 }}>
          Get Profit Kit $29
        </button>
      </div>
    </div>
  );
}