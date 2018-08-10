'use strict';
const {Strategy: LocalStrategy} = require('passport-local');

// Assigns the Strategy export to the name JwtStrategy using object destructuring
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
const {Strategy: JwtStrategy,ExtractJwt} = require('passport-jwt');

const {User}=require('../Models/user-model');
const JWT_SECRET=process.env.JWT_SECRET;

const localStrategy = new LocalStrategy((user, password, callback) => {
  let user_text;
  console.log(user, password);
  User.findOne({ user: user })
    .then(_user => {
        user_text = _user;
      if (!user_text) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect user name or password'
        });
      }
      return user_text.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect user name or password'
        });
      }
      return callback(null, user_text);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return callback(null, false, err);
      }
      return callback(err, false);
    });
});

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256']
  },
  (payload, done) => {
    done(null, payload.user);
  }
);

module.exports = { localStrategy, jwtStrategy };