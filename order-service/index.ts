const express = require("express");
const app = express();


app.post('/orders', (req, res) => {
    res.json({
        status: 'success'
    });
});

app.get('/', (req, res) => {
    res.json({
        status: 'I am running'
    });
});

const port = process.env.PORT || 3002;

app.listen(port, () => console.log(`App listening on PORT ${port}`));
