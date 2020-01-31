const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
  create: (req, res, next) => {
    userModel.create({
      phoneNumber: req.body.phoneNumber,
      username: req.body.username,
      password: req.body.password,
    }, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        console.log('user added')
        const token = jwt.sign({ id: result._id }, process.env.MYAPIKEY,
          { expiresIn: 86400 });
        res.json({
          status: "success",
          message: "User added successfully!",
          token: token,
          user: result
        });
      }
    });
  },

  addGroup: (req, res, next) => {
    console.log(req)
    userModel.findByIdAndUpdate(
      req.body.userId,
      { $push: { groups: req.body.group } },
      (err, doc) => {
        if (err) {
          res.send(err)
        } else {
          res.send(req.body)
        }
      })
  },

  authenticate: (req, res, next) => {
    userModel.findOne({ phoneNumber: req.body.phoneNumber }, (err, userInfo) => {
      if (err) {
        next(err)
      } else {

        if (bcrypt.compareSync(req.body.password, userInfo.password)) {
          const token = jwt.sign({ id: userInfo._id }, process.env.MYAPIKEY,
            { expiresIn: 86400 });

          res.json({
            status: "success",
            message: "User found!",
            data: {
              user: userInfo,
              token: token
            }
          })
        } else {
          res.json({
            status: "error",
            message: "invalid user information",
            data: null
          });
        }
      }
    });
  },
}