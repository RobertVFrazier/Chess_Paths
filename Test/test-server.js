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
const createAuthToken=(user)=>{
  return jwt.sign({user},JWT_SECRET,{
    subject: user.user,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth=passport.authenticate('local',{session: false});
router.use(bodyParser.json());
// The user provides a user name and password to login
router.post('/login',localAuth,(req,res) => {
  const authToken=createAuthToken(req.user.serialize());
  res.json({authToken});
});

const jwtAuth=passport.authenticate('jwt',{session: false});
console.log(jwtAuth);

describe('Games',()=>{
    before(()=>{
        return runServer(process.env.DATABASE_URL || 'mongodb://localhost:27017/chess-paths');
    });
    after(()=>{
        return closeServer();
    });

    it('should list all games on GET',()=>{
        return chai.request(app)
        .get('/api/games')
        .set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXIiOiJQZXRlclBhcmtlciIsImlkIjoiNWI3ODllYTE0ZGEyYzY2MTkwYWVjYjM2In0sImlhdCI6MTUzNTM4ODA3NSwiZXhwIjoxNTM3OTgwMDc1LCJzdWIiOiJQZXRlclBhcmtlciJ9.B7ASprBbYFSyuuUfIOwW3sl878HYirZs2GpU8BeL_YQ',
            'Content-Type','application/json')  // Seems I should be able to get a variable for that jwt above. Can't see how.
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
        .set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXIiOiJQZXRlclBhcmtlciIsImlkIjoiNWI3ODllYTE0ZGEyYzY2MTkwYWVjYjM2In0sImlhdCI6MTUzNTM4ODA3NSwiZXhwIjoxNTM3OTgwMDc1LCJzdWIiOiJQZXRlclBhcmtlciJ9.B7ASprBbYFSyuuUfIOwW3sl878HYirZs2GpU8BeL_YQ',
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
        .set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXIiOiJQZXRlclBhcmtlciIsImlkIjoiNWI3ODllYTE0ZGEyYzY2MTkwYWVjYjM2In0sImlhdCI6MTUzNTM4ODA3NSwiZXhwIjoxNTM3OTgwMDc1LCJzdWIiOiJQZXRlclBhcmtlciJ9.B7ASprBbYFSyuuUfIOwW3sl878HYirZs2GpU8BeL_YQ',
            'Content-Type','application/json')
        .then((res)=>{
            updateData.id=res.body[0]._id;
            return chai.request(app)
            .put(`/api/games/${updateData.id}`)
            .set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXIiOiJQZXRlclBhcmtlciIsImlkIjoiNWI3ODllYTE0ZGEyYzY2MTkwYWVjYjM2In0sImlhdCI6MTUzNTM4ODA3NSwiZXhwIjoxNTM3OTgwMDc1LCJzdWIiOiJQZXRlclBhcmtlciJ9.B7ASprBbYFSyuuUfIOwW3sl878HYirZs2GpU8BeL_YQ',
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
        .set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXIiOiJQZXRlclBhcmtlciIsImlkIjoiNWI3ODllYTE0ZGEyYzY2MTkwYWVjYjM2In0sImlhdCI6MTUzNTM4ODA3NSwiZXhwIjoxNTM3OTgwMDc1LCJzdWIiOiJQZXRlclBhcmtlciJ9.B7ASprBbYFSyuuUfIOwW3sl878HYirZs2GpU8BeL_YQ',
            'Content-Type','application/json')
        .then((res)=>{
            let deleteId=res.body[0]._id;
            return chai.request(app)
            .delete(`/api/games/${deleteId}`)
            .set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXIiOiJQZXRlclBhcmtlciIsImlkIjoiNWI3ODllYTE0ZGEyYzY2MTkwYWVjYjM2In0sImlhdCI6MTUzNTM4ODA3NSwiZXhwIjoxNTM3OTgwMDc1LCJzdWIiOiJQZXRlclBhcmtlciJ9.B7ASprBbYFSyuuUfIOwW3sl878HYirZs2GpU8BeL_YQ',
                'Content-Type','application/json')
        })
        .then((res)=>{
            res.should.have.status(204);
        });
    });
});