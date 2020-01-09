const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var ImageSchema = new Schema({
    img: {
        data: Buffer,
        contentType: String
    }
}

);

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;