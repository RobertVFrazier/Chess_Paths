'use strict';
const express=require('express');
const passport=require('passport');
const bodyParser=require('body-parser');
const jwt=require('jsonwebtoken');

const router=express.Router();

const JWT_SECRET=process.env.JWT_SECRET;
const JWT_EXPIRY=process.env.JWT_EXPIRY || '7d';
const createAuthToken=function(user) {
  return jwt.sign({user}, JWT_SECRET, {
    subject: user.user,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth=passport.authenticate('local', {session: false});
router.use(bodyParser.json());
// The user provides a user name and password to login
router.post('/login', localAuth, (req, res) => {
  const authToken=createAuthToken(req.user.serialize());
  res.json({authToken});
});

const jwtAuth=passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken=createAuthToken(req.user);
  res.json({authToken});
});

module.exports={router};