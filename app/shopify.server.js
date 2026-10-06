import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

function cleanUrl(v) {
  return (v || "").trim().replace(/^"|"$/g, "").replace(/\/$/, "");
}
function cleanKey(v) {
  return (v || "").trim().replace(/^"|"$/g, "");
}

const scopesString = cleanKey(process.env.SCOPES || "write_products,read_products,read_orders,read_customers");

const shopify = shopifyApp({
  apiKey: cleanKey(process.env.SHOPIFY_API_KEY),
  apiSecretKey: cleanKey(process.env.SHOPIFY_API_SECRET) || "",
  apiVersion: ApiVersion.July25,
  scopes: scopesString.split(",").map((s) => s.trim()).filter(Boolean),
  appUrl: cleanUrl(process.env.SHOPIFY_APP_URL || ""),
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
});

export default shopify;
export const apiVersion = ApiVersion.July25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;