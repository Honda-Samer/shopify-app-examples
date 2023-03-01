import { useParams } from "react-router-dom";
import { Card, Page, Layout, SkeletonBodyText } from "@shopify/polaris";
import { Loading, TitleBar } from "@shopify/app-bridge-react";
import { useAppQuery } from "../../hooks";
import { DiscountForm } from "../../components";

export default function QRCodeEdit() {
  const breadcrumbs = [{ content: "Discounts", url: "/" }];

  const { id } = useParams();

  /*
    Fetch the QR code.
    useAppQuery uses useAuthenticatedQuery from App Bridge to authenticate the request.
    The backend supplements app data with data queried from the Shopify GraphQL Admin API.
  */
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

  /* Loading action and markup that uses App Bridge and Polaris components */
  if (isLoading || isRefetching) {
    return (
      <Page>
        <TitleBar
          title="Edit Discount code"
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
        title="Edit QR code"
        breadcrumbs={breadcrumbs}
        primaryAction={null}
      />
      <DiscountForm Discount={discount} />
    </Page>
  );
}
