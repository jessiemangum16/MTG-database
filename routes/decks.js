const express = require("express");
const routes = express.Router();
const mongoose = require('mongoose')

const bodyParser = require("body-parser");
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

const decks = require('../models/decks');



//Get ALL
routes.get("/", (req, res) => {
    decks.find({})
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
routes.get("/:deckName", (req, res) => {
  const deckName = req.params.deckName;

  decks.countDocuments({ deckName: deckName })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid name.");
      } else {
        decks.find({ deckName: deckName })
        .then((data) => {
          res.status(200).send(data);
          console.log(`returned ${req.params.deckName}`);
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
  if (
    !req.body.deckName ||
    !req.body.cardId
  ) {
    res
      .status(400)
      .json(
        "Please fill in all required fields"
      );
  }else{

  const deck = new decks(req.body);
    deck.save()
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
routes.put("/:deckName", (req, res) => {
  const deckName = req.params.deckName;

  if (
    !req.body.deckName ||
    !req.body.cardId
  ) {
    res
      .status(400)
      .json(
        "Please fill in all required fields"
      );
  }else{

  decks.countDocuments({ deckName: deckName })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid name.");
      } else {
        decks.findOne({ deckName: deckName }, (err, deck) => {
          deck.deckName = req.params.deckName;
          deck.cardId = req.body.cardId;
          deck.save(function (err) {
            if (err) {
              res.status(500).json(err || 'Some error occurred while updating the deck.');
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
routes.delete("/:deckName", (req, res) => {
  const deckName = req.params.deckName;

  decks.countDocuments({ deckName: deckName })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid deck name.");
      } else {
        decks.deleteOne({ deckName: deckName }, function (err, result) {
          if (err) {
            res.status(500).json(err || 'Some error occurred while deleting the deck.');
          } else {
            res.status(200).send(result);
          }
        })
          .catch((error) => console.error(error));
      }
    });
});

module.exports = routes;
