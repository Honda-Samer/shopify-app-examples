import axios from "axios";
import { VendorDB } from "../vendor-db.js";
import shopify from "../shopify.js";

export default function endpoints(router) {
    router.post('/api/vendor', async (req, res) => {
        const vendor = (await axios.post('http://127.0.0.1:3030/api/vendor', req.body)).data;

        await VendorDB.create({ id: vendor._id });
        const db = await VendorDB.read()
        console.log(db);

        res.send(vendor)
    });

    router.patch('/api/vendor', async (req, res) => {
        const vendor_id = (await VendorDB.read())[0].id
        const vendor = (await axios.patch(`http://127.0.0.1:3030/api/vendor/${vendor_id}`, req.body)).data;
        res.send(vendor)
    });

    router.get('/api/vendor', async (req, res) => {
        const vendor_id = (await VendorDB.read())[0]?.id
        if (!vendor_id) res.send(null)
        const response = await axios.get(`http://127.0.0.1:3030/api/vendor/${vendor_id}`)
        res.send(response.data);
    });
}