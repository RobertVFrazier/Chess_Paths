'use strict';

const bcrypt=require('bcryptjs');
const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    user: {type: String,required: true,unique: true},
    password: {type: String,required: true},
    games: [{type: mongoose.Schema.Types.ObjectId,ref: 'Game'}],
    created: {type: Date,default: Date.now}
});

userSchema.methods.serialize=function(){
    return{
        user: this.user || '',
        id: this._id
    };
};

userSchema.methods.validatePassword=function(password){
    return bcrypt.compare(password,this.password);
};

userSchema.statics.hashPassword=function(password){
    return bcrypt.hash(password,10);
};

const User=mongoose.model('User',userSchema);

module.exports={User};