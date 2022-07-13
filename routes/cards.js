const express = require("express");
const routes = express.Router();
const mongoose = require('mongoose')

const bodyParser = require("body-parser");
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

const cards = require('../models/cards');
const users = require('../models/User');


//Get ALL
routes.get("/", (req, res) => {

    /*
  #swagger.tags = ['Cards'] 
  #swagger.summary = Get all cards
  #swagger.security = [{
    "JWT": []
  }]
  */

    cards.find({})
    .then((data) => {
      res.status(200).send(data);
      console.log("returned all");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving data.'
      });
    });
});

//Get ONE
routes.get("/:cardName", (req, res) => {

    /*
  #swagger.tags = ['Cards'] 
  #swagger.summary = Get one card by card name
  #swagger.security = [{
    "JWT": []
  }]
  */

  const cardName = req.params.cardName;

  cards.countDocuments({ cardName: cardName })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid name.");
      } else {
        cards.find({ cardName: cardName })
        .then((data) => {
          res.status(200).send(data);
          console.log(`returned ${req.params.cardName}`);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || 'Some error occurred while retrieving data.'
          });
        });
      }
    });
});

//Get All cards with user id X
routes.get("/:userId", (req, res) => {

    /*
  #swagger.tags = ['User Cards'] 
  #swagger.summary = Get all cards for current user
  #swagger.security = [{
    "JWT": []
  }]
  */

  const userId = req.params.userId;

  users.countDocuments({ googleId: userId })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid userID.");
      } else {
        users.find({ googleId: userId })
        .then((data) => {
          res.status(200).send(data);
          console.log(`returned all cards with user Id ${req.params.userId}`);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || 'Some error occurred while retrieving data.'
          });
        });
      }
    });
});

//Add new
routes.post("/", (req, res) => {

    /*
  #swagger.tags = ['Cards'] 
  #swagger.summary = Add new card to database
  #swagger.security = [{
    "JWT": []
  }]
  */

  if (
    !req.body.cardName ||
    !req.body.manaCost ||
    !req.body.color ||
    !req.body.rarity ||
    !req.body.typeId ||
    !req.body.creatureId ||
    !req.body.abilityId ||
    !req.body.description ||
    !req.body.power ||
    !req.body.toughness
  ) {
    res
      .status(400)
      .json(
        "Please fill in all required fields"
      );
  }else{

  const card = new cards(req.body);
    card.save()
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating.'
      });
    });
  }
});

//Update
routes.put("/:cardName", (req, res) => {

    /*
  #swagger.tags = ['Cards'] 
  #swagger.summary = Update existing card by name
  #swagger.security = [{
    "JWT": []
  }]
  */

  const cardName = req.params.cardName;

  if (
    !req.body.cardName ||
    !req.body.manaCost ||
    !req.body.color ||
    !req.body.rarity ||
    !req.body.typeId ||
    !req.body.creatureId ||
    !req.body.abilityId ||
    !req.body.description ||
    !req.body.power ||
    !req.body.toughness
  ) {
    res
      .status(400)
      .json(
        "Please fill in all required fields"
      );
  }else{

  cards.countDocuments({ cardName: cardName })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid name.");
      } else {
        cards.findOne({ cardName: cardName }, (err, card) => {
          card.cardName = req.body.cardName;
          card.manaCost = req.body.manaCost;
          card.color = req.body.color;
          card.rarity = req.body.rarity;
          card.typeId = req.body.typeId;
          card.creatureId = req.body.creatureId;
          card.abilityId = req.body.abilityId;
          card.description = req.body.description;
          card.power = req.body.power;
          card.toughness = req.body.toughness;
          card.save(function (err) {
            if (err) {
              res.status(500).json(err || 'Some error occurred while updating the card.');
            } else {
              res.status(200).send();
            }
          })
        })
      }
    })
  }
})

//Delete
routes.delete("/:cardName", (req, res) => {

    /*
  #swagger.tags = ['Cards'] 
  #swagger.summary = Delete existing card by name
  #swagger.security = [{
    "JWT": []
  }]
  */

  const cardName = req.params.cardName;

  cards.countDocuments({ cardName: cardName })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid card name.");
      } else {
        cards.deleteOne({ cardName: cardName }, function (err, result) {
          if (err) {
            res.status(500).json(err || 'Some error occurred while deleting the card.');
          } else {
            res.status(200).send(result);
          }
          //Chris-Added .clone() to fix MongooseError: Query was already executed error 07/01/2022
        }).clone()
          .catch((error) => console.error(error));
      }
    });
});

//Add a card to user card list
routes.post("/:cardName/:userId", (req, res) => {

    /*
  #swagger.tags = ['User Cards'] 
  #swagger.summary = Add card to users cards by card Id
  #swagger.security = [{
    "JWT": []
  }]
  */

  const cardName = req.params.cardName;
  const userId = profile.id;
  if(!userId || !cardName){
    res.status(400).json("Must use a valid user id and card name.");
  }
  else{
    users.countDocuments({ googleId: userId })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Could not find user.");
      } else {
        cards.countDocuments({ cardName: cardName })
        .then(function (num) {
          if (num === 0) {
            res.status(400).json("Could not find card.");
          } else {
            users.findOne({ googleId: userId }, (err, user) => {
              user.cards.push(cardName);
              user.save(function (err) {
                if (err) {
                  res.status(500).json(err || 'Some error occurred while updating the card.');
                } else {
                  res.status(200).send();
                }
              })
            })
          }
        }).catch((error) => console.error(error));     
      }
    }).catch((error) => console.error(error));
  }
});

module.exports = routes;
