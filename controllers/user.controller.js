const db = require("../models");
const kafkaClient = require("../kafka")
const kafkaConfig = require("../kafka/config")
const { v4: uuidv4 } = require('uuid');
const User = db.user;
const Op = db.Sequelize.Op;

const producer = kafkaClient.producer;

// Create and Save a new Tutorial
exports.create = (req, res) => {

    // Validate request
  if (!req.body.firstName) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a Tutorial
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  };
  // Save Tutorial in the database
  User.create(user)
    .then(data => {
      kafkaClient.sendActionMessage("USER_CREATE_SUCCESS", data)
      res.send(data);
    })
    .catch(err => {
      kafkaClient.sendActionMessage("USER_CREATE_FAIL", req.body)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    }); 
};
// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const firstName = req.query.firstName;
    var condition = firstName ? { firstName: { [Op.like]: `%${firstName}%` } } : null;
    User.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    User.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find User with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with id=" + id
        });
      });
};
// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    User.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          kafkaClient.sendActionMessage("USER_UPDATE_SUCCESS", data)
          res.send({
            message: "User was updated successfully."
          });
        } else {
          kafkaClient.sendActionMessage("USER_UPDATE_FAIL", req.params)
          res.send({
            message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating User with id=" + id
        });
      });
};
// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    User.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          kafkaClient.sendActionMessage("USER_DELETE_SUCCESS", data)
          res.send({
            message: "User was deleted successfully!"
          });
        } else {
          kafkaClient.sendActionMessage("USER_DELETE_FAIL", req.params)
          res.send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User with id=" + id
        });
      });
};
// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          kafkaClient.sendActionMessage("USER_FLUSH_SUCCESS")
          res.send({ message: `${nums} Users were deleted successfully!` });
        })
        .catch(err => {
          kafkaClient.sendActionMessage("USER_FLUSH_FAIL")
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all users."
          });
        });
};
