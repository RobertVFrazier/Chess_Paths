'use strict';

const bcrypt=require('bcryptjs');
const mongoose=require('mongoose');
mongoose.Promise=global.Promise;

const UserSchema=mongoose.Schema({
    user: {type: String,required: true,unique: true},
    password: {type: String,required: true},
    games: [{type: mongoose.Schema.Types.ObjectId,ref: 'game'}],
    created: {type: Date,default: Date.now}
});

UserSchema.methods.serialize=function(){
    return{
        user: this.user || ''
    };
};

UserSchema.methods.validatePassword=function(password){
    return bcrypt.compare(password,this.password);
};

UserSchema.statics.hashPassword=function(password){
    return bcrypt.hash(password,10);
};

const User=mongoose.model('user',UserSchema);

module.exports={User};