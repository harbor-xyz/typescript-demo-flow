import express from "express";
const app = express();


app.post('/orders', (req, res) => {
    res.json({
        status: 'success'
    });
});


const port = process.env.PORT || 3002;

app.listen(port, () => console.log(`App listening on PORT ${port}`));