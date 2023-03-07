import { useParams } from "react-router-dom";
import { Page } from "@shopify/polaris";
import { Loading, TitleBar } from "@shopify/app-bridge-react";
import { useAppQuery } from "../../hooks";
import { DiscountForm } from "../../components";

export default function DiscountEdit() {
  const breadcrumbs = [{ content: "Discounts", url: "/" }];

  const { id } = useParams();
  
  const {
    data: discount,
    isLoading,
    isRefetching,
  } = useAppQuery({
    url: `http://127.0.0.1:3030/api/discount/${id}`,
    reactQueryOptions: {
      refetchOnReconnect: false,
    },
  });

  if (isLoading || isRefetching) {
    return (
      <Page>
        <TitleBar
          title="Edit Discount"
          breadcrumbs={breadcrumbs}
          primaryAction={null}
        />
        <Loading />
      </Page>
    );
  }

  return (
    <Page>
      <TitleBar
        title="Edit Discount"
        breadcrumbs={breadcrumbs}
        primaryAction={null}
      />
      <DiscountForm Discount={discount} />
    </Page>
  );
}
