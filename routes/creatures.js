const express = require("express");
const routes = express.Router();
const mongoose = require('mongoose')

const bodyParser = require("body-parser");
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

const creatures = require('../models/creatures');



//Get ALL
routes.get("/", (req, res) => {
    creatures.find({})
    .then((data) => {
      res.status(200).send(data);
      console.log("returned all");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving creature.'
      });
    });
});

//Get ONE
routes.get("/:creatureName", (req, res) => {
  const creatureName = req.params.creatureName;

  creatures.countDocuments({ creatureName: creatureName })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid creature name.");
      } else {
        creatures.find({ creatureName: creatureName })
        .then((data) => {
          res.status(200).send(data);
          console.log(`returned ${req.params.creatureName}`);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || 'Some error occurred while retrieving creature.'
          });
        });
      }
    });
});

//Add new
routes.post("/", (req, res) => {
  if (
    !req.body.creatureId ||
    !req.body.creatureName
  ) {
    res
      .status(400)
      .json(
        "Please fill in all required fields"
      );
  }else{

  const creature = new creatures(req.body);
    creature.save()
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the creature.'
      });
    });
  }
});

//Update
routes.put("/:creatureName", (req, res) => {
  const creatureName = req.params.creatureName;

  if (
    !req.body.creatureId ||
    !req.body.creatureName
  ) {
    res
      .status(400)
      .json(
        "Please fill in all required fields"
      );
  }else{

  creatures.countDocuments({ creatureName: creatureName })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid creature name.");
      } else {
        creatures.findOne({ creatureName: creatureName }, (err, creature) => {
          creature.creatureId = req.params.creatureId;
          creature.creatureName = req.body.creatureName;
          creature.save(function (err) {
            if (err) {
              res.status(500).json(err || 'Some error occurred while updating the creature.');
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
routes.delete("/:creatureName", (req, res) => {
  const creatureName = req.params.creatureName;

  creatures.countDocuments({ creatureName: creatureName })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid creature name.");
      } else {
        creatures.deleteOne({ creatureName: creatureName }, function (err, result) {
          if (err) {
            res.status(500).json(err || 'Some error occurred while deleting the creature.');
          } else {
            res.status(200).send(result);
          }
        })
          .catch((error) => console.error(error));
      }
    });
});

module.exports = routes;
