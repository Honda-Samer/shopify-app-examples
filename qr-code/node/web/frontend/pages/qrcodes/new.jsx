import { Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { DiscountForm } from "../../components";

export default function ManageCode() {
  const breadcrumbs = [{ content: "Discounts", url: "/" }];

  return (
    <Page>
      <TitleBar
        title="Create new Discount"
        breadcrumbs={breadcrumbs}
        primaryAction={null}
      />
      <DiscountForm />
    </Page>
  );
}
