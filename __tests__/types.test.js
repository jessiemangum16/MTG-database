const mongoose = require('mongoose')
const express = require('express')
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const request = require('supertest');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8084;

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

  describe('Sample Test To Test Testing Setup', () => {
    //Test 1
    it('Should create a type', async () => {
        const res = await request(app).post('/types')
        .send({
            typeId: 'Test1234',
            typeName: 'Test'
        })
      expect(res.status).toBe(200)
    })
    //Test 2
    it('Should not create a type', async () => {
        const res = await request(app).post('/types')
        .send({
            typeId: 'Test1234'
        })
      expect(res.status).toBe(400)
    })
    //Test 3
    it('Should find a type', async () => {
        const res = await request(app).post('/types')
        .send({
            typeId: 'Test1234',
            typeName: 'Test'
        })
        const find = await request(app).get('/types/Test')
        .send({
            typeId: 'Test1234',
            typeName: 'Test'
        })
      expect(find.status).toBe(200)
    })
    //Test 4
    it('Should not find a type', async () => {
        const res = await request(app).post('/types')
        .send({
            typeId: 'Test1234',
            typeName: 'Test'
        })
        const find = await request(app).get('/types/Fail')
        .send({
            typeId: 'Test1234',
            typeName: 'Test'
        })
      expect(find.status).toBe(400)
    })
    //Test 5
    it('Should not find a type', async () => {
        const find = await request(app).get('/types/Fail')
        .send({
            typeId: 'Test1234',
            typeName: 'Test'
        })
      expect(find.status).toBe(400)
    })
    //Test 6
    it('Should update a type', async () => {
        const res = await request(app).post('/types')
        .send({
            typeId: 'Test1234',
            typeName: 'Test'
        })
        const update = await request(app).put('/types/Test')
        .send({
            typeId: 'Test1234',
            typeName: 'Testing123'
        })
      expect(update.status).toBe(200)
    })
    //Test 7
    it('Should not update a type', async () => {
        const res = await request(app).post('/types')
        .send({
            typeId: 'Test1234',
            typeName: 'Test'
        })
        const update = await request(app).put('/types/Fail')
        .send({
            typeId: 'Test1234',
            typeName: 'Testing123'
        })
      expect(update.status).toBe(400)
    })
    //Test 8
    it('Should not update a type', async () => {
             const update = await request(app).put('/types/Test')
        .send({
            typeId: 'Test1234',
            typeName: 'Test'
        })
      expect(update.status).toBe(400)
    })
    //Test 9
    it('Should delete a type', async () => {
        const res = await request(app).post('/types')
        .send({
            typeId: 'Test1234',
            typeName: 'Test'
        })
        const update = await request(app).delete('/types/Test')
        expect(update.status).toBe(200)
    })
    //Test 10
    it('Should not delete a type', async () => {
        const update = await request(app).delete('/types/Test')
        expect(update.status).toBe(400)
    })
    //Test 11
    it('Should get all the types', async () => {
        const res = await request(app).get('/types')
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