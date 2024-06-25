// requires
const express = require("express");
const handlebars = require("express-handlebars");
const db = require("../config/connect.js"); //verbinding mongoDB
const userModel = require("../models/user.js");
const adminUserModel = require("../models/adminUser.js");
const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;
const bodyParser = require("body-parser");
const { authenticate } = require('../config/auth.js');
require("dotenv").config();



const router = express.Router();
const error = new Error("Plaatsgevonden error");

// Deze parser dat de encoded url geparsed wordt.
router.use(bodyParser.urlencoded({ extended: false }));

//dit autenticate de gebruiker
router.get("/", authenticate, lovemeter);
// dit rendered de juiste pagina na het uitvoeren van de functie.
async function lovemeter(req, res) {
  try {
    const userid = req.session.userid;
    const currentUser = await userModel.findOne({ email: userid }).lean();

    await res.render("lovemeter", {
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

    res.render("lovemeter", {
      layout: "index",
      data: result.data,
    });
  }catch (err) {
    console.error(err);
  }
});

//deze maakt een call naar de api met de ingevulde velden en wacht daarna op een response. hij geeft ook de api key mee die in de .env file staat.
const getLoveData = async (name1, name2) => {
  try {
    const url = `${endpoint}?name1=${name1}&name2=${name2}`;

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
