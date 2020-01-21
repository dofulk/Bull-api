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
        next(err)
      } else {
        res.send({
          status: "success",
          message: "User added successfully!",
          data: null
        });
      }
    });
  },

  authenticate: (req, res, next) => {
    userModel.findOne({ phoneNumber: req.body.phoneNumber }, (err, userInfo) => {
      if (err) {
        next(err)
      } else {
        
        if (bcrypt.compareSync(req.body.password, userInfo.password)) {
          const token = jwt.sign({ id: userInfo._id }, process.env.MYAPIKEY,
            { expiresIn: '1h' });

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