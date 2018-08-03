'use strict';

const mongoose=require('mongoose');
mongoose.Promise=global.Promise;

const UserSchema=mongoose.Schema({
    user: {type: String,required: true},
    password: {type: String,required: true},
    games: [{type: mongoose.Schema.Types.ObjectId, ref: 'game'}],
    created: {type: Date,default: Date.now}
});

const User = mongoose.model('user', UserSchema);

module.exports = {User};