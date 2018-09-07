'use strict';
const express=require('express');
const passport=require('passport');
const bodyParser=require('body-parser');
const jwt=require('jsonwebtoken');
const router=express.Router();
const JWT_SECRET=process.env.JWT_SECRET;
const JWT_EXPIRY=process.env.JWT_EXPIRY || '7d';
const mongoose = require('mongoose');
const chai=require('chai');
const chaiHttp=require('chai-http');
const request=require('supertest');
const {app,runServer,closeServer}=require('../server-index');
const should=chai.should();
chai.use(chaiHttp);
const jwtAuth=passport.authenticate('jwt',{session: false});
const {Game}=require('../Models/game-model');
const {User}=require('../Models/user-model');

const seedDataGames=()=>{
    const seedData=[
        {"puzzle": "queen", "moves": ["A1", "C1", "C3", "E5"]},
        {"puzzle": "queen", "moves": ["D5", "G2", "G8", "B8"]},
        {"puzzle": "queen", "moves": ["C5", "F8", "H6", "E3"]},
        {"puzzle": "queen", "moves": ["C5", "C8", "A6", "F1"]},
        {"puzzle": "queen", "moves": ["A3", "H3", "D7", "A4"]},
        {"puzzle": "queen", "moves": ["G8", "C4", "G4", "D1"]},
        {"puzzle": "queen", "moves": ["C5", "C1", "G1", "G5", "D5"]},
        {"puzzle": "queen", "moves": ["H8", "A1", "A8", "H1"]},
        {"puzzle": "queen", "moves": ["G6", "G4", "B4", "B6", "D8", "F6"]},
        {"puzzle": "queen", "moves": ["H8", "E5", "H2", "G1", "A1", "D4", "A7", "B8"]}
    ]
    return Game.insertMany(seedData);
};

describe('Games',()=>{
    let user='', token='';
    before(()=>{
        return runServer(process.env.TESTDATABASE_URL || 'mongodb://localhost:27017/chess-paths-test',8090)
        .then(()=>{
            return chai.request(app)
            .post('/api/users')
            .set('Content-Type','application/json')
            .send({user: 'testuser',password: 'pass12345'})
            .then((res)=>{
                user=res.body;
            })
            .then(()=>{
                return chai.request(app)
                .post('/api/auth/login/')
                .set('Content-Type','application/json')
                .send({user: 'testuser',password: 'pass12345'})
                .then((res)=>{
                    token=res.body.authToken;
                    const newGame={moves: '["H8","E5","H2"]',puzzle: 'queen'};
                    return chai.request(app)
                    .post('/api/games')
                    .set('Authorization',`Bearer ${token}`,
                        'Content-Type','application/json')
                    .send(newGame)
                })
            })
        });
    });

    beforeEach(()=>{
        return seedDataGames();
    });

    afterEach(()=>{
        return tearDownDb();
    });

    after(()=>{
        return chai.request(app)
        .delete(`/api/users/${user.id}`)
        .then(()=>{
            return closeServer();
        })
    });

    it('should list all games on GET',()=>{
        return chai.request(app)
        .get('/api/games')
        .set('Authorization',`Bearer ${token}`,
            'Content-Type','application/json')
        .then((res)=>{
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.length.should.be.at.least(1);
            const expectedKeys=['moves','user','puzzle'];
            res.body.forEach((item)=>{
            item.should.be.a('object');
            item.should.include.keys(expectedKeys);
            });
        });
    });

    it('should add a game on POST.',()=>{
        const newGame={moves: '["H8","E5","H2"]',puzzle: 'queen'};
        return chai.request(app)
        .post('/api/games')
        .set('Authorization',`Bearer ${token}`,
            'Content-Type','application/json')
        .send(newGame)
        .then((res)=>{
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys('moves','puzzle');
            res.body._id.should.not.be.null;
        });
    });

    it('should update a game on PUT.',()=>{
        const updateData={moves: '["A1","A8"]',puzzle: 'queen2'};

        return chai.request(app)
        .get('/api/games')
        .set('Authorization',`Bearer ${token}`,
            'Content-Type','application/json')
        .then((res)=>{
            updateData.id=res.body[0]._id;
            return chai.request(app)
            .put(`/api/games/${updateData.id}`)
            .set('Authorization',`Bearer ${token}`,
                'Content-Type','application/json')
            .send(updateData);
        })
        .then((res)=> {
            res.should.have.status(204);
        });
    });

    it('should delete a game on DELETE.',()=>{
        return chai.request(app)
        .get('/api/games')
        .set('Authorization',`Bearer ${token}`,
            'Content-Type','application/json')
        .then((res)=>{
            let deleteId=res.body[0]._id;
            return chai.request(app)
            .delete(`/api/games/${deleteId}`)
            .set('Authorization',`Bearer ${token}`,
                'Content-Type','application/json')
        })
        .then((res)=>{
            res.should.have.status(204);
        });
    });
});

const seedDataUsers=()=>{
    const seedData=[
        {"user": "ClarkKent", "password": "gr33nKsUx"},
        {"user": "PeterParker", "password":  "W3bz43vaH"},
        {"user": "AlanScott", "password":  "N0w0Od"},
        {"user": "TonyStark", "password":  "Av3ngr#1"},
        {"user": "DinahLance", "password":  "1CeCr34m"},
        {"user": "OroroMonroe", "password":  "Xg0dD355"},
        {"user": "LoisLane", "password":  "5c00P3dU"},
        {"user": "JanetVanDyne", "password":  "Bu22m3"}
    ]
    return User.insertMany(seedData);
};

describe('Users',()=>{
    let user='', token='';
    before(()=>{
        return runServer(process.env.TESTDATABASE_URL || 'mongodb://localhost:27017/chess-paths-test',8090)
        .then(()=>{
            return chai.request(app)
            .post('/api/users')
            .set('Content-Type','application/json')
            .send({user: 'testuser',password: 'pass12345'})
            .then((res)=>{
                user=res.body;
            })
            .then(()=>{
                return chai.request(app)
                .post('/api/auth/login/')
                .set('Content-Type','application/json')
                .send({user: 'testuser',password: 'pass12345'})
                .then((res)=>{
                    token=res.body.authToken;
                    return token;
                })
            })
        });
    });

    beforeEach(()=>{
        return seedDataUsers();
    });

    afterEach(()=>{
        return tearDownDb();
    });

    after(()=>{
        return chai.request(app)
        .delete(`/api/users/${user.id}`)
        .then(()=>{
            return closeServer();
        })
    });

    it('should list all users on GET',()=>{
        return chai.request(app)
        .get('/api/users')
        .set('Authorization',`Bearer ${token}`,
            'Content-Type','application/json')
        .then((res)=>{
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys('user','password');
            res.body._id.should.not.be.null;
        });
    });

    it('should add a user on POST.',()=>{
        const newUser={user: 'testmyuser002',password: 'pass98765'};
        return chai.request(app)
        .post('/api/users')
        .set('Authorization',`Bearer ${token}`,
            'Content-Type','application/json')
        .send(newUser)
        .then((res)=>{
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys('user','password');
            res.body._id.should.not.be.null;
        });
    });

    it('should update a user on PUT.',()=>{
        const updateData={user: 'testuser',password: '12345pass'};

        return chai.request(app)
        .get('/api/users')
        .set('Authorization',`Bearer ${token}`,
            'Content-Type','application/json')
        .then((res)=>{
            updateData.id=res.body[0]._id;
            return chai.request(app)
            .put(`/api/users/${updateData.id}`)
            .set('Authorization',`Bearer ${token}`,
                'Content-Type','application/json')
            .send(updateData);
        })
        .then((res)=> {
            res.should.have.status(204);
        });
    });

    it('should delete a user on DELETE.',()=>{
        return chai.request(app)
        .get('/api/users')
        .set('Authorization',`Bearer ${token}`,
            'Content-Type','application/json')
        .then((res)=>{
            let deleteId=res.body[0]._id;
            return chai.request(app)
            .delete(`/api/users/${deleteId}`)
            .set('Authorization',`Bearer ${token}`,
                'Content-Type','application/json')
        })
        .then((res)=>{
            res.should.have.status(204);
        });
    });
});

const tearDownDb=()=>{
    console.warn('Deleting the database.');
    return mongoose.connection.dropDatabase();
};