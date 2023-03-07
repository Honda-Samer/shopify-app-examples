import { useNavigate } from "@shopify/app-bridge-react";
import {
  Card,
  IndexTable,
  Stack,
  TextStyle,
  UnstyledLink,
} from "@shopify/polaris";

/* useMedia is used to support multiple screen sizes */
import { useMedia } from "@shopify/react-hooks";

/* dayjs is used to capture and format the date a QR code was created or modified */
import dayjs from "dayjs";

/* Markup for small screen sizes (mobile) */
function SmallScreenCard({ discount }) {
  return (
    <UnstyledLink onClick={() => navigate(`/Discounts/${id}`)}>
      <div
        style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #E1E3E5" }}
      >
        <Stack>
          <Stack.Item>
            <p>
              <TextStyle variation="strong">
                {truncate(discount.desc, 35)}
              </TextStyle>
            </p>
            <p>{dayjs(desc.createdDate).format("MMMM D, YYYY")}</p>
          </Stack.Item>
        </Stack>
      </div>
    </UnstyledLink>
  );
}

export function DiscountIndex({ Discounts, loading }) {
  const navigate = useNavigate();

  /* Check if screen is small */
  const isSmallScreen = useMedia("(max-width: 640px)");

  /* Map over Discounts for small screen */
  const smallScreenMarkup = Discounts.map((Discount) => (
    <SmallScreenCard key={Discount.id} navigate={navigate} discount={Discount} />
  ));

  const resourceName = {
    singular: "Discount",
    plural: "Discounts",
  };

  const rowMarkup = Discounts.map(
    (discount, index) => {
      const deletedProduct = (!!discount?.deleted_at);

      if(!deletedProduct)
        return (
          <IndexTable.Row
            id={discount?._id}
            key={discount?._id}
            position={index}
            onClick={() => {
              navigate(`/discounts/${discount?._id}`);
            }}
          >
            <IndexTable.Cell>
              <UnstyledLink data-primary-link url={`/discounts/${discount?._id}`}>
                {discount?.desc} 
              </UnstyledLink>
            </IndexTable.Cell>

            <IndexTable.Cell>
              <UnstyledLink data-primary-link url={`/discounts/${discount?._id}`}>
                {discount?.discount_value} 
              </UnstyledLink>
            </IndexTable.Cell>

            <IndexTable.Cell>
              <UnstyledLink data-primary-link url={`/discounts/${discount?._id}`}>
              {discount?.discount_type}
              </UnstyledLink>
            </IndexTable.Cell>

            <IndexTable.Cell>
              <UnstyledLink data-primary-link url={`/discounts/${discount?._id}`}>
              {discount?.discount_cap}
              </UnstyledLink>
            </IndexTable.Cell>

            <IndexTable.Cell>
              <UnstyledLink data-primary-link url={`/discounts/${discount?._id}`}>
              {discount?.max_uses_per_user}
              </UnstyledLink>
            </IndexTable.Cell>

            <IndexTable.Cell>
              {dayjs(discount?.createdDate).format("MMMM D, YYYY")}
            </IndexTable.Cell>

            <IndexTable.Cell>
              <UnstyledLink data-primary-link url={`/discounts/${discount?._id}`}>
              {discount?.uses.length}
              </UnstyledLink>
            </IndexTable.Cell>
          </IndexTable.Row>
        );
    }
  );

  /* A layout for small screens, built using Polaris components */
  return (
    <Card>
      {isSmallScreen ? (
        smallScreenMarkup
      ) : (
        <IndexTable
          resourceName={resourceName}
          itemCount={Discounts.length}
          headings={[
            { title: "Description" },
            { title: "Discount Value" },
            { title: "Discount Type" },
            { title: "Discount Cap" },
            { title: "Maximum Uses per User" },
            { title: "Date created" },
            { title: "Total Number of Uses" },
          ]}
          selectable={false}
          loading={loading}
        >
          {rowMarkup}
        </IndexTable>
      )}
    </Card>
  );
}

/* A function to truncate long strings */
function truncate(str, n) {
  return str?.length > n ? str.substr(0, n - 1) + "…" : str;
}
