const express = require('express');
const errormiddleware = require("./middleware/error")
const app= express();
const cookieparser = require('cookie-parser')
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const cors = require('cors');

app.use(express.json());
app.use(cookieparser())
app.use(cors());


app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
//////Routhe Import

const user = require("./Routes/userRouth");


app.use("/api/v1", user)


///middleware error


module.exports = app; 