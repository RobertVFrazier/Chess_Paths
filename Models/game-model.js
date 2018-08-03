'use strict';

const mongoose=require('mongoose');
mongoose.Promise=global.Promise;

const GameSchema=mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    puzzle: {type: String,required: true},
    moves: [{type: String,required: true}],
    created: {type: Date,default: Date.now}
});

const Game = mongoose.model('game', GameSchema);

module.exports = {Game};