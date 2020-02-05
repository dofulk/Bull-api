// Dev only
require('dotenv').config();
//
const express = require('express');
const app = express();
app.use(express.json())
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const auth = require('./middleware/auth')
const Comment = require('./models/comment');
const groupController = require('./controllers/group')
const userController = require('./controllers/user')
const Image = require('./models/image');
const multer = require('multer');
const fs = require('fs')


const Mongo = 'mongodb://localhost/backroomdb';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload');
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, file.originalname);
  }
});
const upload = multer({ dest: 'uploads/' });

io.set('origins', '*:*');



// app.use(express.urlencoded({extended: false}));

mongoose.connect(Mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});


const db = mongoose.connection;

db.on('open', (ref) => {
  console.log("Connected to mongo server.")
});

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// io.on('connection', (socket) => {
//   console.log('user connected')
//   socket.on('message', (msg) => {
//     Comment.create(msg).then(comment => {
//       console.log(comment);
//       comment.save((err) => {
//         if (err) console.log(err)
//       });
//       io.emit('message', comment)
//     });
//   });
// });

io.on('error', console.error.bind(console, 'io error'));

app.post('/message', auth, (res, req, next) => {
  Comment.create(req.req.body).then(msg => {
    console.log(msg);
    msg.save((err) => {
      if (err)
        res.send(err)
    })
    io.emit('message', msg)
  })
});

app.post('/users', userController.create)

app.post('/users/login', userController.authenticate)

app.post('/upload', auth, upload.single('image'), (req, res, next) => {
  try {
    res.send(req.file);
  } catch (err) {
    res.send(400)
  }
});

app.get('/uploads/:id', (req, res, next) => {
  let path = req.params.id
  res.sendFile(path, {root: './uploads'})
});


app.post('/group',
  auth,
  groupController.create,
  userController.addGroup
);


http.listen(3000, function () {
  console.log('listening on *:3000');
});
