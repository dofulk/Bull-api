const express = require('express');
const app = express();
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
const upload = multer({ dest: 'uploads/' });
io.set('origins', '*:*');

app.use(express.json())
// app.use(express.urlencoded({extended: false}));

mongoose.connect(Mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});


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
});

io.on('error', console.error.bind(console, 'io error'));

app.post('/users',  userController.create)

app.post('/users/login', userController.authenticate)

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


app.post('/group', auth, (req, res) => {
  res.send('hi')
})


http.listen(3000, function () {
  console.log('listening on *:3000');
});
