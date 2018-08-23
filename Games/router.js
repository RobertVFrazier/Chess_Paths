'use strict';
const express=require('express');
const bodyParser=require('body-parser');
const {Game}=require('../Models/game-model');
const {User}=require('../Models/user-model');
const router=express.Router();
const passport=require('passport');
const jsonParser=bodyParser.json();
const jwtAuth=passport.authenticate('jwt',{session: false});

// CREATE one game for the current user, using the JWT. Tested; working.
router.post('/',jwtAuth,jsonParser,(req,res)=>{
let {puzzle,moves}=req.body;
  return User
  .findById(req.user.id)  // load the user from the db
  .then( user=>{
    return Game.create({   //actually create the game
      user: user._id, //associate the user with the game
      puzzle,
      moves
    })
    .then(game=>{
      user.games.push(game._id); //associate game with user
      return user
        .save()  //save the changed user
        .then( user=>{
          return res.status(201).json(game); //respond
      })
    })
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

// READ all games for the current user, using the JWT. Tested; working.
router.get('/',jwtAuth,(req,res)=>{
  console.log(req.user);
  User.findById(req.user.id).populate('games')
    .then(user=>res.json(user.games))
    .catch(err=>res.status(500).json({
        message: `Could not get any games for user: ${req.user.user}. Internal server error.`
      })
    );
});

// READ one game, given the game _id, using the JWT. Tested; working.
router.get('/:id',jwtAuth,(req,res)=>{  // NOTE: Replace :id with the id number, no quotes.
  return Game.findById(req.params.id)   // Example: localhost:8080/api/games/5b6085f50d94523750b5de06
  .then(gameFound=>{res.json(gameFound)})
  .catch(err=>{
    console.error(err);
    res.status(500).json({error: `Could not get the game: '${req.params.id}'.`})
  });
});

// UPDATE one game, given the game _id, using the JWT. Tested; working.
router.put('/:id',jwtAuth,(req,res)=>{
  // NOTE: In the body, use the key "id", not "_id".
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)){
    return res.status(400).json({
      error: `The request path id (${req.params.id}) and the request body id (${req.body.id}) values must match.`
    });
  }

  const updated={};
  const updateableFields=['moves','created'];
  updateableFields.forEach(field=>{
    if(field in req.body){
      updated[field]=req.body[field];
    }
  });

  return Game.findByIdAndUpdate(req.params.id,{$set: updated},{new: true})
  .then(updatedGame=>res.status(204).end())
  .catch(err=>{
    console.error(err);
    res.status(500).json({error: `Could not update the game: '${req.params.id}'.`})
  });
});

// DELETE one game, given the game _id, using the JWT. Tested; working.
router.delete('/:id',jwtAuth,(req,res)=>{
  return Game.findByIdAndRemove(req.params.id)
  .then(()=>{
    res.status(204).json({message:`Deleted game: '${req.params.id}'.`})
  })
  .catch(err=>{
    console.error(err);
    res.status(500).json({error:`Could not delete game: '${req.params.id}'.`});
  });
});

module.exports={router};