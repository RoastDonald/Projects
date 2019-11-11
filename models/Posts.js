const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const post = Schema({
    imagePath:{
      type:String,
        required:false
    },
    id:{
        type:Number,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('post',post);
