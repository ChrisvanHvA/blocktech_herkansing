// requires
const express = require("express");
const handlebars = require("express-handlebars");
const db = require("../config/connect.js"); //verbinding mongoDB
const userModel = require("../models/user");
const adminUserModel = require("../models/adminUser");
const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;
const bodyParser = require("body-parser");
const { authenticate } = require('../config/auth');
require("dotenv").config();

// ---

const router = express.Router();
const error = new Error("Plaatsgevonden error");

// Middleware to parse URL-encoded bodies
router.use(bodyParser.urlencoded({ extended: false }));

// Route to render the form
router.get("/", authenticate, lovechecker);

async function lovechecker(req, res) {
  try {
    const userid = req.session.userid;
    const currentUser = await userModel.findOne({ email: userid }).lean();

    await res.render("lovechecker", {
      layout: "index",
      data: currentUser,
    });
  } catch (error) {
    console.error(error);
  }
}

const endpoint = 'https://api.apiverve.com/v1/lovecalculator';

// Route to handle form submission
router.post("/result", authenticate, async function (req, res) {
    
  const { name1, name2 } = req.body;

  try {
    const result = await getLoveData(name1, name2);

    console.log(result.data)

    res.render("lovechecker", {
      layout: "index",
      data: result.data,
    });
  }catch (err) {
    console.error(err);
  }
});

const getLoveData = async (name1, name2) => {
  try {
    const url = `${endpoint}?name1=${name1}&name2=${name2}`;

    console.log(url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        'x-api-key': process.env.API_KEY,
      },
    });

    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error(error);
  }
}

module.exports = router;
