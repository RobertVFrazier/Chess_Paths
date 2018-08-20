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
  console.log(req.user);
  return res.json(req.user);
});

// CREATE GAMES

app.post('/games',(req,res)=>{
  const requiredFields=['user','puzzle','moves'];
  for(let i=0; i<requiredFields.length; i++){
    const field=requiredFields[i];
    if(!(field in req.body)){
      const message=`Missing '${field}' in reqest body.`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Game
    .create({
      user: req.body.user,
      puzzle: req.body.puzzle,
      moves: req.body.moves
    })
    .then(game=>res.status(201).json(game))
    .catch(err=>{
      console.error(err);
      res.status(500).json({error: `Could not create the save game file for '${req.body.user}'.`});
    });
});

// READ GAMES

app.get('/games',(req,res) => {
  Game
    .find().populate("user")
    .then(games=>{
      res.json(games);
    })
    .catch(err=>{
      console.error(err);
      res.status(500).json({ error: 'Could not get any games.' });
    });
});

app.get('/games/:id',(req,res)=>{  // NOTE: Replace :id with the id number, no quotes.
  Game                             // Example: localhost:8080/games/5b6085f50d94523750b5de06
    .findById(req.params.id).populate("user")
    .then(game=>{
      res.json(game);
    })
    .catch(err=>{
      console.error(err);
      res.status(500).json({error: `Could not get game: '${req.params.id}'.`})
    });
});

// UPDATE GAMES

app.put('/games/:id',(req,res)=>{  // NOTE: Replace :id with the id number, no quotes.
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

  Game
    .findByIdAndUpdate(req.params.id,{$set: updated},{new: true})
    .then(updatedGame=>res.status(204).end())
    .catch(err=>{
      console.error(err);
      res.status(500).json({error: `Could not update game: '${req.params.id}'.`})
    });
});

// DELETE GAMES

app.delete('/games/:id',(req,res)=>{  // NOTE: Replace :id with the id number, no quotes.
  Game                                // Example: localhost:8080/games/5b6085f50d94523750b5de06
    .findByIdAndRemove(req.params.id)
    .then(()=>{
      res.status(204).json({message:`Deleted game: '${req.params.id}'.`})
    })
    .catch(err=>{
      console.error(err);
      res.status(500).json({error:`Could not delete game: '${req.params.id}'.`});
    });
});

// Don't know if I'll need all CRUD endpoints for the users. I'll add them for completeness.
// The two that are absolutely necessary are Post: because the games Post endpoint can't work until
// there is a user, and Get: because I will need to restrict the saved games to the current user.

// CREATE USERS

// app.post('/users',(req,res)=>{
//   const requiredFields=['user','password'];
//   for(let i=0; i<requiredFields.length; i++){
//     const field=requiredFields[i];
//     if(!(field in req.body)){
//       const message=`Missing '${field}' in reqest body.`;
//       console.error(message);
//       return res.status(400).send(message);
//     }
//   }

//   User
//     .create({
//       user: req.body.user,
//       password: req.body.password
//     })
//     .then(user=>res.status(201).json(user))
//     .catch(err=>{
//       console.error(err);
//       res.status(500).json({error: `Could not create the user file for '${req.body.user}'.`});
//     });
// });



// READ USERS

// app.get('/users',(req,res) => {
//   User
//     .find()
//     .then(users=>{
//       res.json(users.map(user=>user));
//     })
//     .catch(err=>{
//       console.error(err);
//       res.status(500).json({ error: 'Could not get any users.' });
//     });
// });

app.get('/users/:id',(req,res)=>{  // NOTE: Replace :id with the id number, no quotes.
  User                             // Example: localhost:8080/users/5b6085710d94523750b5de05
    .findById(req.params.id)
    .then(user=>{
      res.json(user);
    })
    .catch(err=>{
      console.error(err);
      res.status(500).json({error: `Could not get user: '${req.params.id}'.`})
    });
});

// UPDATE USERS   (No immediate plans to do this.)

app.put('/users/:id',(req,res)=>{  // NOTE: Replace :id with the id number, no quotes.
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)){
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

  User
    .findByIdAndUpdate(req.params.id,{$set: updated},{new: true})
    .then(updatedUser=>res.status(204).end())
    .catch(err=>{
      console.error(err);
      res.status(500).json({error: `Could not update user: '${req.params.id}'.`})
    });
});

// DELETE USERS   (No immediate plans to do this.)

app.delete('/users/:id',(req,res)=>{  // NOTE: Replace :id with the id number, no quotes.
  User                                // Example: localhost:8080/users/5b6085710d94523750b5de05
    .findByIdAndRemove(req.params.id)
    .then(()=>{
      res.status(204).json({message:`Deleted user: '${req.params.id}'.`})
    })
    .catch(err=>{
      console.error(err);
      res.status(500).json({error:`Could not delete user: '${req.params.id}'.`});
    });
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