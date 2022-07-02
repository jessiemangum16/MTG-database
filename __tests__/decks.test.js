const mongoose = require('mongoose')
const express = require('express')
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const request = require('supertest');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8083;

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

  describe('Testing decks.js', () => {
    //Test 1
    it('Should create a new deck', async() => {
      const res = await request(app).post('/decks')
      .send({
        deckName: 'Test',
        cardId: ['Test1234','Test5678', 'Test12AB']
      })
      expect(res.status).toEqual(200)
    })
    //Test 2
    it('Should not create a new deck', async() => {
        const res = await request(app).post('/decks')
        .send({
          cardId: ['Test1234','Test5678', 'Test12AB']
        })
        expect(res.status).toEqual(400)
      })
    //Test 3
    it('Should find a deck', async() => {
        const res = await request(app).post('/decks')
        .send({
          deckName: 'Test',
          cardId: ['Test1234','Test5678', 'Test12AB']
        })
        const find = await request(app).get('/decks/Test')
        expect(find.status).toEqual(200)
      })
      //Test 4
      it('Should not find a deck', async() => {
        const res = await request(app).post('/decks')
        .send({
          deckName: 'Test',
          cardId: ['Test1234','Test5678', 'Test12AB']
        })
        const find = await request(app).get('/decks/Fail')
        expect(find.status).toEqual(400)
      })
      //Test 5
      it('Should not find a deck', async() => {
        const find = await request(app).get('/decks/Fail')
        expect(find.status).toEqual(400)
      })

      //Test 6
      it('Should update a deck', async() => {
        const res = await request(app).post('/decks')
        .send({
          deckName: 'Test',
          cardId: ['Test1234','Test5678', 'Test12AB']
        })
        const update = await request(app).put('/decks/Test')
        .send({
            deckName: 'Test',
            cardId: ['Test123','Test678', 'Test2AB']
        })
        expect(update.status).toEqual(200)
      })
      //Test 7
      it('Should not update a deck', async() => {
        const res = await request(app).post('/decks')
        .send({
          deckName: 'Test',
          cardId: ['Test1234','Test5678', 'Test12AB']
        })
        const update = await request(app).put('/decks/Fail')
        .send({
            deckName: 'Test',
            cardId: ['Test123','Test678', 'Test2AB']
        })
        expect(update.status).toEqual(400)
      })
      //Test 8
      it('Should not update a deck', async() => {
        const update = await request(app).put('/decks/Fail')
        .send({
            deckName: 'Test',
            cardId: ['Test123','Test678', 'Test2AB']
        })
        expect(update.status).toEqual(400)
      })
      //Test 9
      it('Should delete a deck', async() => {
        const res = await request(app).post('/decks')
        .send({
          deckName: 'Test',
          cardId: ['Test1234','Test5678', 'Test12AB']
        })
        const find = await request(app).delete('/decks/Test')
        expect(find.status).toEqual(200)
      })
      //Test 10
      it('Should not delete a deck', async() => {
        const find = await request(app).delete('/decks/Test')
        expect(find.status).toEqual(400)
      })
      //Test 11
      it('Should get all decks', async() => {
        const find = await request(app).get('/decks')
        expect(find.status).toEqual(200)
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