const mongoose = require('mongoose')
const express = require('express')
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const request = require('supertest');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8082;

beforeAll(() => {
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

  describe('Testing creatures.js', () => {
    //Test 1
    it('Should create a new creature', async () => {
        //create an ability
      const res = await request(app).post('/creatures')
      .send({
        creatureId: 'Test1234',
        creatureName: 'Test'
      })
      expect(res.status).toEqual(200);
    })

     //Test 2
     it('Should not create a new creature', async () => {
        //create an creature
      const res = await request(app).post('/creatures')
      .send({
        creatureName: 'Test'
      })
      expect(res.status).toEqual(400);
    })

     //Test 3
     it('Should find a creature', async () => {
        //create a creature
      const res = await request(app).post('/creatures')
      .send({
        creatureId: 'Test1234',
        creatureName: 'Test'
      })
      //Look for it
      const find = await request(app).get('/creatures/Test');
      expect(find.status).toEqual(200)
    })
    //Test 4
    it('Should not find a creature', async () => {
        //create a creature
      const res = await request(app).post('/creatures')
      .send({
        creatureId: 'Test1234',
        creatureName: 'Test'
      })
      //Look for it
      const find = await request(app).get('/creatures/Fail');
      expect(find.status).toEqual(400)
    })
     //Test 5
     it('Should not find a creature', async () => {
      //Look for it
      const find = await request(app).get('/creatures/Fail');
      //Test
      expect(find.status).toEqual(400)
    })
    //Test 6
    it('Should update a creature', async () => {
        //create a creature
        const res = await request(app).post('/creatures')
        .send({
        creatureId: 'Test1234',
        creatureName: 'Test'
    })
    //update it
    const update = await request(app).put('/creatures/Test')
    .send({
        creatureId: 'Test1234',
        creatureName: 'Test1'
    })
    expect(update.status).toEqual(200)
    })
    //test 7
    it('Should not update a creature', async () => {
        //create a creature
        const res = await request(app).post('/creatures')
        .send({
        creatureId: 'Test1234',
        creatureName: 'Test'
    })
    //update it
    const update = await request(app).put('/creatures/Fail')
    .send({
        creatureId: 'Test1234',
        creatureName: 'Test1'
    })
    expect(update.status).toEqual(400)
    })
    //Test 8
    it('Should not update a creature', async () => {       
    //update it
    const update = await request(app).put('/creatures/Fail')
    .send({
        creatureId: 'Test1234',
        creatureName: 'Test1'
    })
    expect(update.status).toEqual(400)
    })
    //Test 9
    it('Should delete a creature by name', async () => {
    //Need to create one
    const res = await request(app).post('/creatures')
    .send({
        creatureId: 'Test1234',
        creatureName: 'Test'
    })
      //delete ability
      const deleteAbility = await request(app).delete('/creatures/Test')
      expect(deleteAbility.status).toEqual(200);
      })
      //test 10
      it('Should not delete an creature by name', async () => {
      //delete ability
      const deleteAbility = await request(app).delete('/creatures/Test')
      expect(deleteAbility.status).toEqual(400);
    })
    //Test 11
    it('Should get all the creature', async () => {
    const res = await request(app).get('/creatures')
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