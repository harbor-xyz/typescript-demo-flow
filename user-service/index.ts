import express from "express";
const app = express();


app.get('/', (req, res) => {
    res.json({
        firstName: 'First',
        lastName: 'Last'
    });
});


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on PORT ${port}`));