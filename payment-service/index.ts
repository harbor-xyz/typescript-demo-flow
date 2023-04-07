import express from "express";
const app = express();


app.get('/payments', (req, res) => {
    res.json({
        cardNumber: '1234 1234 1234 1234',
        expiry: '10/30'
    });
});


const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`App listening on PORT ${port}`));