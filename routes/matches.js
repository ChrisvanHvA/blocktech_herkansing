// requires
const express = require("express");
const handlebars = require("express-handlebars");
const db = require("../config/connect.js"); //verbinding mongoDB
const userModel = require("../models/user");
const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;

const { authenticate } = require('../config/auth');

// ---

const router = express.Router();




router.get("/", authenticate,  async (req, res) => {
  try {

    const userid = req.session.userid
    const currentUser = await userModel.findOne({
      email: userid,
    }).populate("matches").lean();

    let userMatches = currentUser.matches


 


    // send result to handlebars
    res.render("matches", {
      layout: "index",
      data: userMatches,
    })

  } catch (err) {
    console.log(err);
  }
});


module.exports = router;
