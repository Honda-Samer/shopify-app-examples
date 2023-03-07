import { Page } from "@shopify/polaris";
import { Loading, TitleBar } from "@shopify/app-bridge-react";
import { useAppQuery } from "../../hooks";
import { VendorForm } from "../../components";

export default function VendorEdit() {
  const breadcrumbs = [{ content: "Shop", url: "/" }];
  
  const {
    data: vendor,
    isLoading,
    isRefetching,
  } = useAppQuery({
    url: `/api/vendor`,
    reactQueryOptions: {
      refetchOnReconnect: false,
    },
  });

  if (isLoading || isRefetching) {
    return (
      <Page>
        <TitleBar
          title="Edit Shop Info"
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
        title="Edit Shop Info"
        breadcrumbs={breadcrumbs}
        primaryAction={null}
      />
      <VendorForm Vendor={vendor} />
    </Page>
  );
}
