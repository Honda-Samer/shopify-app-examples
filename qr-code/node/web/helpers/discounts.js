import '@shopify/shopify-api/adapters/node';
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
import express from 'express';

const shopify = shopifyApi({
  // The next 4 values are typically read from environment variables for added security
  apiKey: 'APIKeyFromPartnersDashboard',
  apiSecretKey: 'APISecretFromPartnersDashboard',
  scopes: ['read_products'],
  hostName: 'ngrok-tunnel-address'
});

const app = express();

const hamada = async () => {
    // await axios.post(`https://tutoruu-discounts.myshopify.com/admin/api/2023-01/price_rules.json`,);
    return
}


module.exports.createDiscount = () => {
    hamada()
    return 'success'
}