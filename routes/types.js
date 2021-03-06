const express = require("express");
const routes = express.Router();
const mongoose = require('mongoose')

const bodyParser = require("body-parser");
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

const types = require('../models/types');

  /*
  #swagger.tags = ['Types'] 
  #swagger.summary = summary
  #swagger.security = [{
    "JWT": []
  }]
  */

//Get ALL
routes.get("/", (req, res) => {

    /*
  #swagger.tags = ['Types'] 
  #swagger.summary = Get all card types
  #swagger.security = [{
    "JWT": []
  }]
  */


    types.find({})
    .then((data) => {
      res.status(200).send(data);
      console.log("returned all");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving type.'
      });
    });
});

//Get ONE
routes.get("/:typeName", (req, res) => {

    /*
  #swagger.tags = ['Types'] 
  #swagger.summary = Get one card type by type name
  #swagger.security = [{
    "JWT": []
  }]
  */


  const typeName = req.params.typeName;

  types.countDocuments({ typeName: typeName })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid type name.");
      } else {
        types.find({ typeName: typeName })
        .then((data) => {
          res.status(200).send(data);
          console.log(`returned ${req.params.typeName}`);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || 'Some error occurred while retrieving type.'
          });
        });
      }
    });
});

//Add new
routes.post("/", (req, res) => {

    /*
  #swagger.tags = ['Types'] 
  #swagger.summary = Add new card type to the database
  #swagger.security = [{
    "JWT": []
  }]
  */


  if (
    !req.body.typeId ||
    !req.body.typeName
  ) {
    res
      .status(400)
      .json(
        "Please fill in all required fields"
      );
  }else{

  const type = new types(req.body);
    type.save()
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the type.'
      });
    });
  }
});

//Update
routes.put("/:typeName", (req, res) => {

    /*
  #swagger.tags = ['Types'] 
  #swagger.summary = Update existing card type in databases
  #swagger.security = [{
    "JWT": []
  }]
  */


  const typeName = req.params.typeName;

  if (
    !req.body.typeId ||
    !req.body.typeName
  ) {
    res
      .status(400)
      .json(
        "Please fill in all required fields"
      );
  }else{

  types.countDocuments({ typeName: typeName })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid type name.");
      } else {
        types.findOne({ typeName: typeName }, (err, type) => {
          //Chris- changed req.params.typeId to req.body.typeId 07/01/2022
          type.typeId = req.body.typeId;
          type.typeName = req.body.typeName;
          type.save(function (err) {
            if (err) {
              res.status(500).json(err || 'Some error occurred while updating the type.');
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
routes.delete("/:typeName", (req, res) => {

    /*
  #swagger.tags = ['Types'] 
  #swagger.summary = Delete existing card from database
  #swagger.security = [{
    "JWT": []
  }]
  */


  const typeName = req.params.typeName;

  types.countDocuments({ typeName: typeName })
    .then(function (num) {
      if (num === 0) {
        res.status(400).json("Must use a valid type name.");
      } else {
        types.deleteOne({ typeName: typeName }, function (err, result) {
          if (err) {
            res.status(500).json(err || 'Some error occurred while deleting the type.');
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
