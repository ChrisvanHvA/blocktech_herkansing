// requires
const express = require("express");
const handlebars = require("express-handlebars");
const db = require("../config/connect.js"); //verbinding mongoDB
const userModel = require("../models/user");
const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;
let globalQuery = {};
const { ObjectId } = require('mongodb'); // Import ObjectId

const getUsers = async (userid) => {
  // find logged in user based on session id
  // haalt de ingelogde gebruiker op
  const currentUser = await userModel
    .findOne({
      email: userid,
    })
    // zonder.lean krijg je een hele lap tekst, laat alleen relefante/essentiele info zien. het versimpeld/meer leesbaar maken.
    .lean(); 

  // get matches, likes and dislikes of current user
  // eerst de ingelogde gebruiker kijken of die matches heeft door de .matches
  const currentUserMatches = currentUser.matches;
  const currentUserLikes = currentUser.likes;
  const currentUserDislikes = currentUser.dislikes;

  const currentUserConcat = [];

  // door deze lijn te gebruiken zorgt die ervoor dat alles in 1 array komt.
  const currentUserInfo = currentUserConcat.concat(currentUserMatches, currentUserLikes, currentUserDislikes)

  // haal alle gebruikers op behalve jezelf. 
  globalQuery["_id"] = { $nin: currentUserInfo }



  // return all users except the already matched ones
  // zoekt de gebruikers, alle waarde geven we mee.
  const usersList = await userModel.find(globalQuery).lean();

  return [usersList, currentUser];
};
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

router.post("/resetMatch/:id", authenticate, async (req, res) => {
  try {
    const userid = req.session.userid;
    console.log("resetting match");

    const matchid = ObjectId(req.params.id); // Convert matchid to ObjectId
    console.log(matchid);

    const [result, currentUser] = await getUsers(userid); // Await getUsers function

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: currentUser._id },
      // { $pull: { matches: matchid } }, // Use matchid as ObjectId
      { $set: { matches: [] }, },
      { new: true }  // To return the modified document
    );

    if (!updatedUser) {
      console.log("User not found or no matches updated.");
      return res.status(404).send("User not found or no matches updated.");
    }

    console.log("Updated user document: ", updatedUser);
    res.redirect("/matches");
  } catch (err) {
    console.log("Error occurred while resetting match: ", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
