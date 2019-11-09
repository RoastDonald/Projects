const mongoose = require('mongoose');
const Shcema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


const user = new Shcema({
    password:{
        type:String,
        required:true
    },
    login:{
        type:String,
        required:true
    }
});

user.methods.encryptPassword = (password)=>{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
};

user.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('user',user);

