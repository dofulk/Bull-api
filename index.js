const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const Comment = require('./models/comment');
const Group = require('./models/group');
const User = require('./models/user');
const Image = require('./models/image');
const multer = require('multer');
const fs = require('fs')

const Mongo = 'mongodb://localhost/backroomdb';
const upload = multer({ dest: 'uploads/' });


io.set('origins', '*:*');

mongoose.connect(Mongo, { useNewUrlParser: true });


const db = mongoose.connection;

db.on('open', (ref) => {
  console.log("Connected to mongo server.")
});

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

io.on('connection', (socket) => {
  console.log('user connected')
  socket.on('message', (msg) => {
    Comment.create(msg).then(comment => {
      console.log(comment);
      comment.save((err) => {
        if (err) console.log(err)
      });
      io.emit('message', comment)
    });
  });
  socket.on('group', (group) => {
    Group.create(group).then(chat => {
      console.log(chat);
      chat.save((err) => {
        if (err) console.log(err)
      });
      io.emit('group', chat)
    });
  });
  socket.on('new_user', (user) => {
    User.create(user).then(usr => {
      console.log(usr);
      usr.save((err) => {
        if (err) console.log(err)
      });
      io.emit('new_user', usr)
    });
  });
});

io.on('error', console.error.bind(console, 'io error'));



app.post('/upload', upload.array('image.jpeg'), (req, res, next) => {
  console.log(req.body.photo)
  Image.create(
    {
      img: {
        data: req.body.file,
        contentType: 'image/jpeg'
      }
    }).then(img => {
      console.log(img)
      res.send(img._id)
    }).catch(err => console.log(err))

})

app.get('/loadphoto', (req, res) => {
  Image.findById(req.query.id, (err, image) => {
    res.contentType(image.img.contentType)
    res.send(image.img.data)
  })
})


app.post('/group', (req, res) => {
  res.send('hi')
})



http.listen(3000, function () {
  console.log('listening on *:3000');
});
