const mongoose = require('mongoose')
const express = require('express')
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const request = require('supertest');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;

beforeAll(async() => {
      mongoose.connect(process.env.MONGODB_URI,
      {useNewUrlParser: true}).then(()  => {
        console.log("Connected to Test Db")
      });
      app.use(bodyParser.json());
      app.use('/', require('../routes'))
      app.listen(port, () => {
        console.log(`Running on port ${port}`)        
    })  
  });

  describe('Testing abilities.js', () => {
    //Test 1
    it('Should create a new ability', async () => {
        //create an ability
      const res = await request(app).post('/abilities')
      .send({
        abilityId: 'Testing1234',
        abilityName: 'Test',
        abilityDescription: 'This is a test.'
      })
      //test
      expect(res.status).toEqual(200);
    })
  
  //Test 2
  it('Should not create a new ability', async () => {
    const res = await request(app).post('/abilities')
    //send some to create an ability. this should give us an 400 status
    .send({
      abilityId: 'Testing1234',
      abilityName: 'NewTest'
    })
    //test
    expect(res.status).toEqual(400);
  })

  
//Test 3
  it('Should find an ability by name', async () => {
    //Need to create one
    const res = await request(app).post('/abilities')
      .send({
        abilityId: 'Testing1234',
        abilityName: 'Test',
        abilityDescription: 'This is a test.'
      })
      //look for ability
      const find = await request(app).get('/abilities/Test');
      //test
      expect(find.status).toEqual(200);
      })
//test 4
it('Should not find an ability by name', async () => {
    const res = await request(app).post('/abilities')
    .send({
        abilityId: 'Testing1234',
        abilityName: 'Test',
        abilityDescription: 'This is a test.'
      })
    //look for ability that is not there
    const find = await request(app).get('/abilities/Fail');
    //test
    expect(find.status).toEqual(400);
})
//test 5
it('Should not find an ability by name', async () => {
    //look for ability that is not there
    const find = await request(app).get('/abilities/Fail');
    //test
    expect(find.status).toEqual(400);
})
//test 6
    it('Should update an ability by name', async () => {
        //Need to create one
        const res = await request(app).post('/abilities')
          .send({
            abilityId: 'Testing1234',
            abilityName: 'Test',
            abilityDescription: 'This is a test.'
          })
          //update ability
          const find = await request(app).put('/abilities/Test')
          .send({
            abilityId: 'Testing1234',
            abilityName: 'Test',
            abilityDescription: 'This is a test.'
          })
          expect(find.status).toEqual(200);
          })
//Test 7
    it('Should not update an ability by name', async () => {    
         //find and update
          const find = await request(app).put('/abilities/Fail')
          .send({
            abilityId: 'Testing1234',
            abilityName: 'Test2',
            abilityDescription: 'This is a test.'
          })
          expect(find.status).toEqual(400);
          })
    //test 8
    it('Should not update an ability by name', async () => {
          //update ability
          const find = await request(app).get('/abilities/fail')
          .send({
            abilityId: 'Testing1234',
            abilityName: 'Test2',
            abilityDescription: 'This is a test.'
          })
          expect(find.status).toEqual(400);
          })
    //test 9      
    it('Should delete an ability by name', async () => {
        //Need to create one
        const res = await request(app).post('/abilities')
          .send({
            abilityId: 'Testing1234',
            abilityName: 'Test',
            abilityDescription: 'This is a test.'
          })
          //delete ability
          const deleteAbility = await request(app).delete('/abilities/Test')
          expect(deleteAbility.status).toEqual(200);
          })
    //test 10
    it('Should not delete an ability by name', async () => {
        //delete ability
        const deleteAbility = await request(app).delete('/abilities/Test')
        expect(deleteAbility.status).toEqual(400);
        })
    //Test 11
    it('Should get all the abilities', async () => {
        const res = await request(app).get('/abilities')
        expect(res.status).toEqual(200);
    })
    })

  function removeAllCollections() {
    const collections =  
    Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
        const collection =
        mongoose.connection.collections[collectionName]
            collection.deleteMany();
        }
    }

afterEach(async ()=> {
    await removeAllCollections();
})

async function dropAllCollections () {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName]
      try {
        await collection.drop()
      } catch (error) {
        // This error happens when you try to drop a collection that's already dropped. Happens infrequently. 
        // Safe to ignore. 
        if (error.message === 'ns not found') return
  
        // This error happens when you use it.todo.
        // Safe to ignore. 
        if (error.message.includes('a background operation is currently running')) return
  
        console.log(error.message)
      }
    }
  }
  
  // Disconnect Mongoose
  afterAll(async () => {
    await dropAllCollections();
    await mongoose.connection.close();
  })