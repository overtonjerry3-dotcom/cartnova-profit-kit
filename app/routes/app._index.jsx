import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { Page, Layout, Card, Text, BlockStack, Button, Banner } from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  return { shop: session.shop };
};

export default function Index() {
  const { shop } = useLoaderData() as { shop: string };
  const [saved, setSaved] = useState(false);

  return (
    <Page title="CartNova - Profit Kit">
      <Layout>
        <Layout.Section>
          {saved && (
            <Banner tone="success" onDismiss={() => setSaved(false)}>
              Settings saved!
            </Banner>
          )}
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Store: {shop}</Text>
              <Text as="h2" variant="headingMd">1. Delivery Date Picker - $9 value</Text>
              <Text as="p" variant="bodyMd">Calendar on cart. Stop failed deliveries. 1 failed delivery = $20 lost.</Text>
              <Text as="h2" variant="headingMd">2. Returns Saver AI - $15 value</Text>
              <Text as="p" variant="bodyMd">Auto-answers where is my order 24/7. Saves 1.5 hrs per day.</Text>
              <Text as="h2" variant="headingMd">3. Smart Quiz - Coming Soon</Text>
              <Text as="p" variant="bodyMd">Find perfect product quiz. Built to lift sales 10-20%.</Text>
              <Button variant="primary" onClick={() => setSaved(true)}>Save Settings</Button>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">Upgrade to $29/mo</Text>
              <Text as="p" variant="bodyMd">Get ALL 3 apps. 14 days free. Cancel anytime.</Text>
              <Button>Start $9.99 Starter</Button>
              <Button variant="primary">Get Profit Kit $29</Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}