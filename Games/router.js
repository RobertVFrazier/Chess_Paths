'use strict';
const express=require('express');
const bodyParser=require('body-parser');
const {Game}=require('../Models/game-model');
const router=express.Router();
const jsonParser=bodyParser.json();

// Post to save a new game.
router.post('/',jsonParser,(req,res)=>{
  const requiredFields=['user','puzzle','moves'];
  const missingField=requiredFields.find(field=>!(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields=['user','puzzle'];
  const nonStringField=stringFields.find(
    field=>field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string.',
      location: nonStringField
    });
  }

  let {user,puzzle,moves}=req.body;

  return Game.create({
      user,
      puzzle,
      moves
    })
    .then(game=>{
      return res.status(201).json(game);
    })
    .catch(err=>{
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened.
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500,message: 'Internal server error'});
    });
});

// GET all games.
router.get('/',(req,res)=>{
  return Game.find()
    .then(games=>res.json(games.map(gameFound=>gameFound)))
    .catch(err=>res.status(500).json({message: 'Could not get any games. Internal server error.'}));
});

// GET one game, given the game _id.
router.get('/:id',(req,res)=>{
  return Game.findById(req.params.id)
  .then(gameFound=>{res.json(gameFound)})
  .catch(err=>{
    console.error(err);
    res.status(500).json({error: `Could not get the game: '${req.params.id}'.`})
  });
});

// GET all games, filtered by the user _id.
router.get('/userid/:id',(req,res)=>{
  return Game.where({user: req.params.id})
  .then(gameFound=>{res.json(gameFound)})
  .catch(err=>{
    console.error(err);
    res.status(500).json({error: `Could not get any games for user: '${req.params.id}'.`})
  });
});

module.exports={router};