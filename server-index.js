'use strict';

require ('dotenv').config();  
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const DATABASE_URL=process.env.DATABASE_URL || 'mongodb://localhost/chess-paths';
const PORT=process.env.PORT || 8080;

const app = express();
const {Game}=require('./Models/game-model');
const {User}=require('./Models/user-model');

app.use(morgan('common'));
app.use(express.static('public'));



// These three lines are replaced with runServer(), below.
// app.listen(process.env.PORT, () => {
//   console.log(`Your app is listening on port ${process.env.PORT}`);
// });

let server;

// Connect to the database and start the server.
function runServer(databaseUrl, port=PORT){
  return new Promise((resolve,reject)=>{
    mongoose.connect(databaseUrl,err=>{
      if(err){
        return reject(err);
      }
      server=app.listen(port,()=>{
        console.log(`Your app is listening on port ${port}.`);
        resolve();
      })
        .on('error',err=>{
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// Close the server. Used for tests.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve,reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// Use this to directly call server-index.js.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {runServer,app,closeServer};