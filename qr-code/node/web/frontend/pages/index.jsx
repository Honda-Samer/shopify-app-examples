import { useNavigate, TitleBar, Loading } from "@shopify/app-bridge-react";
import {
  Card,
  EmptyState,
  Layout,
  Page,
  SkeletonBodyText,
} from "@shopify/polaris";
import { useEffect } from "react";
import { DiscountIndex, VendorForm } from "../components";
import { useAppQuery } from "../hooks";

export default function HomePage() {
  const navigate = useNavigate();
  
  const { isLoading, data, isRefetching } = useAppQuery({ url: `/api/vendor/` });

  let Discounts
  useEffect(() => {  
    if (!data) return Discounts = null;
    console.log(Discounts)
  }, [data])

  const loadingMarkup = isLoading ? (
    <Card sectioned>
      <Loading />
      <SkeletonBodyText />
    </Card>
  ) : null;

  const VendorFormMarkup = !data && !isLoading ? ( <VendorForm /> ) : null;
  
  const DiscountsMarkup = data?.discounts?.length ? (
    <DiscountIndex Discounts={data.discounts} loading={isRefetching} />
  ) : null;

  const emptyStateMarkup =
    !isLoading && !data?.discounts?.length && !!data ? (
      <Card sectioned>
        <EmptyState
          heading="Create discounts for your products"
          action={{
            content: "Create New Discount",
            onAction: () => navigate("/discounts/new"),
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
  
  const titleBar = isLoading? null : (!data && !isLoading) ? ( <TitleBar title="Create Your Vendor Account On Tutoruu" /> ) :
    ( <TitleBar
      title="Discounts"
      primaryAction={{
          content: "Update Shop Info",
          onAction: () => navigate("/vendors/edit"),
        }}
      secondaryActions={{
        content: "Create New Discount",
        onAction: () => navigate("/discounts/new"),
      }}
  /> )

  return (
    <Page fullWidth={!!DiscountsMarkup}>
      {titleBar} 
      <Layout>
        <Layout.Section>
          {loadingMarkup}
          {VendorFormMarkup}
          {DiscountsMarkup}
          {emptyStateMarkup}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
