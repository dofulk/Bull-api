const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req, res, next) => {
    const token = req.header('Authorization')
    // put JWT key in .env
    jwt.verify(token, process.env.MYAPIKEY,
    (err, decoded) => {
        if (err) {
          res.json({status:"error", message: err.message, data:null});
        }else{
          // add user id to request
          req.body.userId = decoded.id;
          next();
        }
      });

}
module.exports = auth