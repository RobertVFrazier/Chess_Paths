'use strict';

const mongoose=require('mongoose');

const gameSchema=mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    puzzle: {type: String,required: true},
    moves: [{type: String,required: true}],
    created: {type: Date,default: Date.now}
});

const Game=mongoose.model('Game',gameSchema);

module.exports={Game};