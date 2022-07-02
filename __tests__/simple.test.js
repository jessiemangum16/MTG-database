const mongoose = require('mongoose')
const express = require('express')
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const request = require('supertest');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;

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
    it('should test that true === true', () => {
      expect(true).toBe(true)
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