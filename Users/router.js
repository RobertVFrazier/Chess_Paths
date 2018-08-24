'use strict';
const express=require('express');
const bodyParser=require('body-parser');
const {Game}=require('../Models/game-model');
const {User}=require('../Models/user-model');
const router=express.Router();
const passport=require('passport');
const jsonParser=bodyParser.json();
const jwtAuth=passport.authenticate('jwt',{session: false});

// I don't think I'll be implementing all of the CRUD endpoints for
// the users in the front end. The one that is absolutely necessary
// is Create (post), because we need to authenticate the user before
// any of the games endpoints will work.

// CREATE a new user, using the login credentials, creating the JWT. Tested; working.
router.post('/',jsonParser,(req,res)=>{
  const requiredFields=['user','password'];
  const missingField=requiredFields.find(field=>!(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields=['user','password'];
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

  // If the user name and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  const explicityTrimmedFields=['user','password'];
  const nonTrimmedField=explicityTrimmedFields.find(
    field=>req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields={
    user: {
      min: 1
    },
    password: {
      min: 8,
      max: 20
    }
  };
  const tooSmallField=Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField=Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {user,password}=req.body;

  return User.find({user})
    .count()
    .then(count=>{
      if (count > 0) {
        // There is an existing user with the same user name.
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'User name already taken',
          location: 'user'
        });
      }
      // If there is no existing user, hash the password.
      return User.hashPassword(password);
    })
    .then(hash=>{
      return User.create({
        user,
        password: hash
      });
    })
    .then(user=>{
      return res.status(201).json(user);
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

// READ all users, using the JWT. Tested; working.
router.get('/',jwtAuth,(req,res)=>{
  return User.findById(req.user.id)
    .then(user=>res.json(user))
    .catch(err=>res.status(500).json({message: 'Could not get any users. Internal server error.'}));
});

// READ one user, given the _id, using the JWT. Tested; working.
router.get('/:id',jwtAuth,(req,res)=>{
  return User.findById(req.params.id)
  .then(userFound=>{res.json(userFound)})
  .catch(err=>{
    console.error(err);
    res.status(500).json({error: `Could not get the user with the id of: '${req.params.id}'.`})
  });
});

// READ one user, given the user name, using the JWT. Tested; working.
// Not needed in the front end any more, but useful for testing.
router.get('/name/:username',jwtAuth,(req,res)=>{
  return User.where({user: req.params.username})
  .then(userFound=>{res.json(userFound)})
  .catch(err=>{
    console.error(err);
    res.status(500).json({error: `Could not get the user with the name of: '${req.params.username}'.`})
  });
});

// UPDATE one user, given the user _id, using the JWT. Tested; working.
//  (No immediate plans to use this.)
router.put('/:id',jwtAuth,(req,res)=>{
  // NOTE: In the body, use the key "id", not "_id".
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)){
    console.log(req.body.id);
    return res.status(400).json({
      error: `The request path id (${req.params.id}) and the request body id (${req.body.id}) values must match.`
    });
  }

  const updated={};
  const updateableFields=['user','password','created'];
  updateableFields.forEach(field=>{
    if(field in req.body){
      updated[field]=req.body[field];
    }
  });

  return User.findByIdAndUpdate(req.params.id,{$set: updated},{new: true})
  .then(updatedUser=>res.status(204).end())
  .catch(err=>{
    console.error(err);
    res.status(500).json({error: `Could not update the user: '${req.params.id}'.`})
  });
});

// DELETE one user, given the user _id, using the JWT. Tested; working.
router.delete('/:id',jwtAuth,(req,res)=>{
  return User.findByIdAndRemove(req.params.id)
  .then(()=>{
    res.status(204).json({message:`Deleted user: '${req.params.id}'.`})
  })
  .catch(err=>{
    console.error(err);
    res.status(500).json({error:`Could not delete user: '${req.params.id}'.`});
  });
});

module.exports={router};