'use strict';
const express=require('express');
const passport=require('passport');
const bodyParser=require('body-parser');
const jwt=require('jsonwebtoken');
const router=express.Router();
const JWT_SECRET=process.env.JWT_SECRET;
const JWT_EXPIRY=process.env.JWT_EXPIRY || '7d';
const chai=require('chai');
const chaiHttp=require('chai-http');
const request=require('supertest');
const {app,runServer,closeServer}=require('../server-index');
const should=chai.should();
chai.use(chaiHttp);
const jwtAuth=passport.authenticate('jwt',{session: false});

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
        const updateData={
            moves: '["A1","A8"]',
            puzzle: 'queen2'
        };

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