import express from "express";
import axios, { AxiosResponse } from 'axios';

const app = express();

interface User {
    firstName: String;
    lastName: String;
}

interface Payment {
    cardNumber: String;
    expiry: String;
}

interface Order {
    status: String
}

app.post('/pwrappers', async (req, res) => {
    let userResult: AxiosResponse = await axios.get('http://user-service.exp2-testing-manual.svc.cluster.local:80/users/');
    let user: User = userResult.data;

    let paymentResult: AxiosResponse = await axios.get('http://payment-service.exp2-testing-manual.svc.cluster.local:80/payments/');
    let payment: Payment = paymentResult.data;

    let orderResult: AxiosResponse = await axios.post('http://order-service.exp2-testing-manual.svc.cluster.local:80/orders/');
    let order: Order = orderResult.data;

    return res.status(200).json({
        user: user,
        payment: payment,
        order: order
    });
});

app.get('/gwrappers', async (req, res) => {
    console.log("I'm getting called");
    let userResult: AxiosResponse = await axios.get('http://user-service.exp2-testing-manual.svc.cluster.local:80/users/');
    let user: User = userResult.data;

    let paymentResult: AxiosResponse = await axios.get('http://payment-service.exp2-testing-manual.svc.cluster.local:80/payments/');
    let payment: Payment = paymentResult.data;

    let orderResult: AxiosResponse = await axios.post('http://order-service.exp2-testing-manual.svc.cluster.local:80/orders/');
    let order: Order = orderResult.data;

    return res.status(200).json({
        user: user,
        payment: payment,
        order: order
    });
});


const port = process.env.PORT || 3003;

app.listen(port, () => console.log(`App listening on PORT ${port}`));