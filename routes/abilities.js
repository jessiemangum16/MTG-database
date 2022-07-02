const express = require("express");
const routes = express.Router();
const mongoose = require('mongoose')

const bodyParser = require("body-parser");
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

const abilities = require('../models/abilities');



//Get ALL
routes.get("/", (req, res) => {
    abilities.find({})
    .then((data) => {
      res.status(200).send(data);
      console.log("returned all");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving ability.'
      });
    });
});

//Get ONE
routes.get("/:abilityName", (req, res) => {
  const abilityName = req.params.abilityName;

  abilities.countDocuments({ abilityName: abilityName })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid ability name.");
      } else {
        abilities.find({ abilityName: abilityName })
        .then((data) => {
          res.status(200).send(data);
          console.log(`returned ${req.params.abilityName}`);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || 'Some error occurred while retrieving ability.'
          });
        });
      }
    });
});

//Add new
routes.post("/", (req, res) => {
  if (
    !req.body.abilityId ||
    !req.body.abilityName ||
    !req.body.abilityDescription
  ) {
    res
      .status(400)
      .json(
        "Please fill in all required fields"
      );
  }else{

  const ability = new abilities(req.body);
    ability.save()
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the ability.'
      });
    });
  }
});

//Update
routes.put("/:abilityName", (req, res) => {
  const abilityName = req.params.abilityName;

  if (
    !req.body.abilityId ||
    !req.body.abilityName ||
    !req.body.abilityDescription
  ) {
    res
      .status(400)
      .json(
        "Please fill in all required fields"
      );
  }else{

  abilities.countDocuments({ abilityName: abilityName })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid ability name.");
      } else {
        abilities.findOne({ abilityName: abilityName }, (err, ability) => {
          //Chris - Changed req.params.abilityId to req.body.abilityId 07/01/2022
          ability.abilityId = req.body.abilityId;
          ability.abilityName = req.body.abilityName;
          ability.abilityDescription = req.body.abilityDescription;
          ability.save(function (err) {
            if (err) {
              res.status(500).json(err || 'Some error occurred while updating the ability.');
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
routes.delete("/:abilityName", (req, res) => {
  const abilityName = req.params.abilityName;

  abilities.countDocuments({ abilityName: abilityName })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid ability name.");
      } else {
        abilities.deleteOne({ abilityName: abilityName }, function (err, result) {
          if (err) {
            res.status(500).json(err || 'Some error occurred while deleting the ability.');
          } else {
            res.status(200).send(result);
          }
          //Chris-Added .clone() to fix MongooseError: Query was already executed error 07/01/2022
        }).clone()
          .catch((error) => console.error(error));
      }
    });
});

module.exports = routes;
