// requires
const express = require("express");
const handlebars = require("express-handlebars");
const db = require("../config/connect.js"); //verbinding mongoDB
const userModel = require("../models/user");
const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;

//checkt of de gebruiker is ingelogd
const {
  authenticate
} = require('../config/auth');

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  try {

    const userid = req.session.userid
    const currentUser = await userModel.findOne({
      email: userid,
    }).populate("matches").lean();
//haalt de ingelogde user op en daarna de matches.

    let userMatches = currentUser.matches
//roep alleen de matches, niet de user zelf.


    // verwerkt de data naar handlebars bestanden voor styling
    res.render("matches", {
      layout: "index",
      data: userMatches,
    })

  } catch (err) {
    console.log(err);
  }
});

router.post("/:id", async (req, res) => {
  // turns id into ObjectId instead of a string with number
  req.params.id = toId(req.params.id);
  const userid = req.session.userid;

  // find the user that's been liked
  const deletedUser = await userModel.findById(req.params.id).lean();

  userModel.updateMany(
    {id: userid},
    { $pull: { matches: deletedUser._id, likes: deletedUser._id } },
    (err, affected) => {
      console.log("affected", affected);
    }
  );

  res.redirect("/matches");
})

module.exports = router;
