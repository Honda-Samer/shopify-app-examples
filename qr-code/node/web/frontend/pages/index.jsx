import { useNavigate, TitleBar, Loading } from "@shopify/app-bridge-react";
import {
  Card,
  EmptyState,
  Layout,
  Page,
  SkeletonBodyText,
} from "@shopify/polaris";
import { useEffect } from "react";
import { QRCodeIndex } from "../components";
import { useAppQuery } from "../hooks";

export default function HomePage() {
  const navigate = useNavigate();

  const vendor_id = '63fe1ffa3f6601858912f8cf';
  const { isLoading, data, isRefetching } = useAppQuery({
    url: `http://127.0.0.1:3030/api/vendor/${vendor_id}`
  });

  let Discounts
  useEffect(() => {  
    if (!data) return Discounts = null;
    console.log(Discounts)
  }, [data])

  /* loadingMarkup uses the loading component from AppBridge and components from Polaris  */
  const loadingMarkup = isLoading ? (
    <Card sectioned>
      <Loading />
      <SkeletonBodyText />
    </Card>
  ) : null;

  /* Set the QR codes to use in the list */
  const DiscountsMarkup = data?.discounts?.length ? (
    <QRCodeIndex Discounts={data.discounts} loading={isRefetching} />
  ) : null;

  /* Use Polaris Card and EmptyState components to define the contents of the empty state */
  const emptyStateMarkup =
    !isLoading && !data?.discounts?.length ? (
      <Card sectioned>
        <EmptyState
          heading="Create discounts for your products"
          /* This button will take the user to a Create a QR code page */
          action={{
            content: "Create New Discount",
            onAction: () => navigate("/qrcodes/new"),
          }}
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>
            Allow customers to scan codes and buy products using their phones.
          </p>
        </EmptyState>
      </Card>
    ) : null;

  /*
    Use Polaris Page and TitleBar components to create the page layout,
    and include the empty state contents set above.
  */
  return (
    <Page fullWidth={!!DiscountsMarkup}>
      <TitleBar
        title="Discounts"
        primaryAction={{
          content: "Create New Discount",
          onAction: () => navigate("/qrcodes/new"),
        }}
      />
      <Layout>
        <Layout.Section>
          {loadingMarkup}
          {DiscountsMarkup}
          {emptyStateMarkup}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
