'use strict';

require ('dotenv').config();  
const express=require('express');
const morgan=require('morgan');
const mongoose=require('mongoose');
const passport=require('passport');
// This destructuring looks like a source of confusion.
const {router: usersRouter}=require('./Users');
const {router: gamesRouter}=require('./Games');
const {router: authRouter,localStrategy,jwtStrategy}=require('./Auth');
mongoose.Promise=global.Promise;

const DATABASE_URL=process.env.DATABASE_URL || 'mongodb://localhost:27017/chess-paths';
const PORT=process.env.PORT || 8080;

const app=express();
const {Game}=require('./Models/game-model');
const {User}=require('./Models/user-model');

app.use(morgan('common'));
app.use(express.json());
app.use(express.static('public'));

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/',usersRouter);
app.use('/api/games/',gamesRouter);
app.use('/api/auth/',authRouter);
const jwtAuth=passport.authenticate('jwt',{session: false});
// A protected endpoint which needs a valid JWT to access it.
app.get('/api/protected',jwtAuth,(req,res)=>{
  return res.json(req.user);
});

// CORS

app.use(function (req,res,next) {
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers','Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

app.use('*',(req,res) => {
  return res.status(404).json({ message: 'Not Found.' });
});

// The next three lines are replaced with runServer(), below.
// app.listen(process.env.PORT,() => {
//   console.log(`Your app is listening on port ${process.env.PORT}`);
// });

let server;

// Connect to the database and start the server.
function runServer(databaseUrl,port=PORT){
  return new Promise((resolve,reject)=>{
    mongoose.connect(databaseUrl,{useNewUrlParser:true},err=>{
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

module.exports={runServer,app,closeServer};