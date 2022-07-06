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
    !req.body.userId
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

      //Add new deck id to users list of decks
      const userId = req.body.userId;
      const deckId = data._id;

      users.countDocuments({ _id: userId }).then(function (num) {
        if (num === 0) {
          res.status(400).json("Couldn't find user");
        } else {
          users.findOneAndUpdate({ _id: userId }, { $push: { decks: deckId } })
          .then((data) => {
            res.status(200).send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || 'Some error occurred while retrieving data.'
            });
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating.'
      });
    });
    
  }
});

//Update
routes.put("/:deckId", (req, res) => {
  const deckId = req.params.deckId;

  if (
    !req.body.deckName
  ) {
    res
      .status(400)
      .json(
        "Please fill in all required fields"
      );
  }else{

  decks.countDocuments({ deckId: deckId })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid name.");
      } else {
        decks.findOne({ deckId: deckId }, (err, deck) => {
          deck.deckName = req.body.deckName;
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

//Add card to deck
routes.post("/:deckId/:cardId", (req, res) => {
  const deckId = req.params.deckId;
  const cardId = req.params.cardId;
  decks.countDocuments({ deckId: deckId })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid name.");
      } else {
        decks.findOne({ deckId: deckId }, (err, deck) => {
          deck.cards.push(cardId);
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
})

//Remove card from deck
routes.delete("/:deckId/:cardId", (req, res) => {
  const deckId = req.params.deckId;
  const cardId = req.params.cardId;
  decks.countDocuments({ deckId: deckId })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid name.");
      } else {
        decks.findOne({ deckId: deckId }, (err, deck) => {
          deck.cards.pull(cardId);
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
})


//Delete
routes.delete("/:deckId", (req, res) => {
  const deckId = req.params.deckId;

  decks.countDocuments({ deckId: deckId })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid deck id.");
      } else {
        decks.deleteOne({ deckId: deckId }, function (err, result) {
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
