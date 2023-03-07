import { useState, useCallback } from "react";
import {
  Card,
  Form,
  FormLayout,
  TextField,
  Select,
  Stack,
  Layout,
  DropZone,
  Thumbnail,
} from "@shopify/polaris";

import {NoteMinor} from '@shopify/polaris-icons';

import {
  ContextualSaveBar,
  useNavigate,
} from "@shopify/app-bridge-react";

import { useAuthenticatedFetch } from "../hooks";

import { useForm, useField, notEmptyString } from "@shopify/react-form";

import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

export function VendorForm({ Vendor: InitialVendor }) {
  const [Vendor, setVendor] = useState(InitialVendor);
  const [file, setFile] = useState();
  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();

  const onSubmit = useCallback(
    (body) => {
      (async () => {
        const shopDomain = new URL(window.location).searchParams.get("shop");
        console.log(shopDomain) 

        let logo;
        if(!!file) logo = await uploadAttachment(file)

        const parsedBody = {
          name: body.name,
          desc: body.desc,
          category: body.category.value,
          logo,
          shopifyShopDomain: shopDomain
        };
        
        const VendorId = Vendor?._id;
        const method = VendorId ? "PATCH" : "POST"; 
        const response = await fetch('/api/vendor', {
          method,
          body: JSON.stringify(parsedBody),
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          makeClean();
          const Vendor = await response.json();
          console.log(Vendor);

          if (!Vendor) {
            navigate(`/vendor/edit`);
          } else {
            setVendor(Vendor)
            navigate('/');
          }
        }
      })();
      return { status: "success" };
    },
    [Vendor, setVendor], [file, setFile]
  );
  
  const {
    fields: {
      name,
      desc,
      category
    },
    dirty,
    reset,
    submitting,
    submit,
    makeClean,
  } = useForm({
    fields: {
      name: useField({
        value: Vendor ? Vendor.name : "",
        validates: [notEmptyString("Please enter your shop name")],
      }),
      desc: useField({
        value: Vendor ? Vendor.desc : "",
        validates: [notEmptyString("Please enter a description for your shop")],
      }),
      category: useField({
        value: Vendor?.category ?? "Food & Beverages"
      }),
    },
    onSubmit,
  });

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFile(acceptedFiles[0]),
    [],
  );

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  
  const fileUpload = !file && <DropZone.FileUpload />;
  const uploadedFiles = !!file && (
    <div style={{padding: '0'}}>
      <Stack vertical>
          <Stack alignment="center" key={'logo'}>
            <Thumbnail
              size="large"
              alt={file.name}
              source={
                validImageTypes.includes(file.type)
                  ? window.URL.createObjectURL(file)
                  : NoteMinor
              }
            />
          </Stack>
        </Stack>
      </div>
    );
    
    const uploadAttachment = async (file) => {
      const firebaseConfig = {
        apiKey: "AIzaSyDe_zYIj1tP93daNmPKjyNFhwcugTcxv8M",
        authDomain: "tutoruu-shopify-plugin-f4552.firebaseapp.com",
        projectId: "tutoruu-shopify-plugin-f4552",
        storageBucket: "tutoruu-shopify-plugin-f4552.appspot.com",
        messagingSenderId: "271753840174",
        appId: "1:271753840174:web:0e0e9e056520c69d8f81bf",
        measurementId: "G-72VSFWGP2N"
      };

      const app = initializeApp(firebaseConfig);

      const myFile = file;
      try {
        if (file && file.name) {
          const fileData = new FormData();
          fileData.append("file", myFile);
          const filePath = `attachments//post/${Date.now()}___${file.name}`;
    
          const metadata = { contentType: myFile.type };
          const storage = getStorage();
          const attachmentRef = ref(storage, filePath);
          return new Promise((resolve, reject) => {
            const uploadTask = uploadBytesResumable(
              attachmentRef,
              myFile,
              metadata
            );
            uploadTask.on(
              "state_changed",
              (snapshot) => {},
              (error) => {},
              () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  resolve(downloadURL);
                });
              }
            );
          });
        }
      } catch (e) {
        console.error(e);
      }
    };

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
                label: "Clear",
                onAction: reset,
                loading: submitting,
                disabled: submitting,
              }}
              visible={dirty}
              fullWidth
            />
            <FormLayout>
              <Card sectioned title="Shop Info">   
                <Card.Section>
                  <TextField
                      {...name}
                      label="Shop Name"
                    />
                </Card.Section>
                <Card.Section>
                  <TextField
                        {...desc}
                        label="Shop Description"
                      />
                </Card.Section>   
                <Card.Section>
                  <Select
                      label="Category"
                      options={[
                        { label: "Food & Beverages", value: "Food & Beverages" },
                        { label: "Shops", value: "Shops" },
                        { label: "Clothing", value: "Clothing" },
                        { label: "Photography Studios", value: "Photography Studios" },
                        { label: "Sports", value: "Sports" },
                        { label: "Health & Wellness", value: "Health & Wellness" },
                        { label: "Art Work", value: "Art Work" },
                        { label: "Summer", value: "Summer" },
                        { label: "Games", value: "Games" },
                        { label: "Services", value: "Services" },
                      ]}
                      value={category.value?.value ?? category.value}
                      onChange={category.onChange}
                    />
                </Card.Section>    
                <Card.Section>
                    <DropZone onDrop={handleDropZoneDrop}>
                      {uploadedFiles}
                      {fileUpload}
                    </DropZone>
                </Card.Section>        
              </Card>
            </FormLayout>
          </Form>
        </Layout.Section>
      </Layout>
    </Stack>
  );
}
