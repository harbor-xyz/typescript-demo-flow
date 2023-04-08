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

app.post('/wrappers', async (req, res) => {
    let userResult: AxiosResponse = await axios.get('http://localhost:3000/users');
    let user: User = userResult.data;

    let paymentResult: AxiosResponse = await axios.get('http://localhost:3001/payments');
    let payment: Payment = paymentResult.data;

    let orderResult: AxiosResponse = await axios.post('http://localhost:3002/orders');
    let order: Order = orderResult.data;

    return res.status(200).json({
        user: user,
        payment: payment,
        order: order
    });
});

app.get('/wrappers', async (req, res) => {
    let userResult: AxiosResponse = await axios.get('http://localhost:3000/users');
    let user: User = userResult.data;

    let paymentResult: AxiosResponse = await axios.get('http://localhost:3001/payments');
    let payment: Payment = paymentResult.data;

    let orderResult: AxiosResponse = await axios.post('http://localhost:3002/orders');
    let order: Order = orderResult.data;

    return res.status(200).json({
        user: user,
        payment: payment,
        order: order
    });
});


const port = process.env.PORT || 3003;

app.listen(port, () => console.log(`App listening on PORT ${port}`));