import { useState, useCallback } from "react";
import {
  Card,
  Form,
  FormLayout,
  TextField,
  ChoiceList,
  Stack,
  Layout,
} from "@shopify/polaris";
import {
  ContextualSaveBar,
  useNavigate,
} from "@shopify/app-bridge-react";

import { useAuthenticatedFetch, useAppQuery } from "../hooks";

import { useForm, useField, notEmptyString } from "@shopify/react-form";

export function DiscountForm({ Discount: InitialDiscount }) {
  const [Discount, setDiscount] = useState(InitialDiscount);
  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();

  const onSubmit = useCallback(
    (body) => {
      (async () => {
        // create discout on core api
        const parsedBody = {
          vendor_id: '63fe1ffa3f6601858912f8cf',
          discount_value: parseFloat(body.discount_value),
          discount_type: body.discount_type[0],
          discount_cap: parseFloat(body.discount_cap),
          max_uses_per_user: parseInt(body.max_uses_per_user.value),
          desc: body.description
        };
        
        const DiscountId = Discount?._id;
        const endpoint = DiscountId ? DiscountId : "";
        const url = `http://127.0.0.1:3030/api/discount/${endpoint}`;
        const method = DiscountId ? "PATCH" : "POST"; 
        const response = await fetch(url, {
          method,
          body: JSON.stringify(parsedBody),
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          makeClean();
          const Discount = (await response.json()).discount;
          console.log(Discount);

          // create discount using shopify api
          // const { createDiscount } = require('../../helpers/discounts')
          // createDiscount()

          if (!Discount) {
            navigate(`/qrcodes/${Discount._id}`);
          } else {
            setDiscount(Discount);
            navigate('/');
          }
        }
      })();
      return { status: "success" };
    },
    [Discount, setDiscount]
  );
  
  const {
    fields: {
      discount_value,
      discount_type,
      discount_cap,
      max_uses_per_user,
      description
    },
    dirty,
    reset,
    submitting,
    submit,
    makeClean,
  } = useForm({
    fields: {
      discount_value: useField({
        value: Discount ? Discount.discount_value : "",
        validates: [notEmptyString("Please enter discount value")],
      }),
      discount_type: useField( Discount ? Discount.discount_type : ["Percentage"] ),
      discount_cap: useField({ value: Discount?.discount_cap ? Discount.discount_cap : "" }),
      max_uses_per_user: useField({ value: Discount?.max_uses_per_user ? Discount.max_uses_per_user : "" }),
      description: useField({ value: Discount?.desc ? Discount.desc : "", validates: [notEmptyString("Please enter a description")] }),
    },
    onSubmit,
  });

  const renderChildren = useCallback(
    () => (
      <TextField
            {...discount_cap}
            type="number"
            label="Maximum Discount Value (For Percentage Discounts)"
          />
    )
  );

  return (
    <Stack vertical>
      <Layout>
        <Layout.Section>
          <Form>
            <ContextualSaveBar
              saveAction={{
                label: "Save",
                onAction: submit,
                loading: submitting,
                disabled: submitting,
              }}
              discardAction={{
                label: "Discard",
                onAction: reset,
                loading: submitting,
                disabled: submitting,
              }}
              visible={dirty}
              fullWidth
            />
            <FormLayout>
              <Card sectioned title="Discount">   
                <Card.Section>
                  <TextField
                        {...description}
                        label="Discount Description"
                      />
                </Card.Section>   
                <Card.Section>
                  <TextField
                      {...discount_value}
                      type="number"
                      label="Discount Value"
                    />
                </Card.Section>
                <Card.Section>
                  <ChoiceList
                      title="Discount Type"
                      choices={[
                        { label: "Percentage", value: "Percentage", renderChildren },
                        {
                          label: "Fixed Rate", value: "Fixed",
                        },
                      ]}
                      selected={discount_type.value}
                      onChange={discount_type.onChange}
                    />
                </Card.Section>
                <Card.Section>
                  <TextField
                        {...max_uses_per_user}
                        type="number"
                        label="Maximum Uses for Each Customer"
                      />
                </Card.Section>               
              </Card>
            </FormLayout>
          </Form>
        </Layout.Section>
      </Layout>
    </Stack>
  );
}
