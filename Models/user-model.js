'use strict';

const mongoose=require('mongoose');
mongoose.Promise=global.Promise;

const userSchema=mongoose.Schema({
    userId: {type: String,required: true},
    password: {type: String,required: true},
    games: [{type: mongoose.Schema.Types.ObjectId, ref: 'Game'}],
    created: {type: Date,default: Date.now}
});

const User = mongoose.model('User', userSchema);

module.exports = {User};