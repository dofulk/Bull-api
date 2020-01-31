const groupModel = require('../models/group');

module.exports = {
  create: (req, res, next) => {
    groupModel.create({
      name: req.body.name,
      users: req.body.users,
    }, (err, result) => {
      if (err) {
        next(err)
      } else {
        req.body.groupId = result.id;
        req.body.name = result.name;
        next()
      }
    });
    
  },

  getById: (req, res, next) => {
    groupModel.findById(req.params.groupId, (err, groupInfo) => {
      if (err) {
        next(err)
      } else {
        res.json({
          status: "success",
          message: "Group found!",
          data: groupInfo
        });
      }
    });
  }
}