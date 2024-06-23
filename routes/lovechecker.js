// requires
const express = require("express");
const handlebars = require("express-handlebars");
const db = require("../config/connect.js"); //verbinding mongoDB
const userModel = require("../models/user");
const adminUserModel = require("../models/adminUser");
const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;
const multer = require("multer")
const {
  authenticate
} = require('../config/auth');


// ---

const router = express.Router();
const upload = multer({
  dest: "public/uploads/"
})

const error = new Error("Plaatsgevonden error")




router.get("/", authenticate, lovechecker);

async function lovechecker(req, res) {
  try {
    const userid = req.session.userid
    const currentUser = await userModel.findOne({
      email: userid,
    }).lean();


    await res.render("lovechecker", {
      layout: "index",
      data: currentUser,
    });
  } catch (error) {
    console.error(error)
  }
}









module.exports = router;