const express = require('express');
const cors = require('cors');
const budget = require("./_budget.json");
const app = express();
const port = 3000;

const mongoose = require("mongoose")
const budgetModel = require("./data/budgetdata")

let url = 'mongodb://127.0.0.1:27017/personalbudget';

app.use(express.json());

app.use('/', express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get('/hello', (req, res) =>{
    res.send('Hello World!');
});

app.get('/budget', (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("connected to database");
            budgetModel.find({})
                .then((data) => {
                    // console.log(data);
                    res.send(data);
                    mongoose.connection.close();
                })
                .catch((connectionError) => {
                    console.log(connectionError)
                })
        })
        .catch((connectionError) => {
            console.log(connectionError);
        })
});


app.post("/postBudgetData", (req, res) => {

    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            // Insert
            console.log("Connection established insert data");
            let newData = new budgetModel(req.body);
            budgetModel.insertMany(newData)
                .then((data) => {
                    res.send("Data has been inserted")
                    mongoose.connection.close();
                })
                .catch((connectionError) => {
                    console.log("1", connectionError)
                    res.send(connectionError.message)
                })
        })
        .catch((connectionError) => {
            console.log("2", connectionError)
            res.send(connectionError);
        })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

