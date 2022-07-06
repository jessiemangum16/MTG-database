const mongoose = require('mongoose')
const express = require('express')
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const request = require('supertest');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8081;

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

  describe('Testing Cards.js', () => {
    //Test 1
    it('Should create a card', async () => {
        //Create a Card
        const res = await request(app).post('/cards')
        .send({
            cardName:'Test',
            manaCost:'99',
            color:'Red',
            rarity:'Common',
            typeId:'Test1234',
            creatureId:'Tes5678',
            abilityId:'Test9101',
            description:'This is a Test',
            power:'99',
            toughness:'99'
        })
        //test
        expect(res.status).toEqual(200);
    })
    //Test 2
    it('Should not create a card', async () => {
        //Create a Card
        const res = await request(app).post('/cards')
        .send({
            cardName:'Test',
            manaCost:'99',
            color:'Red',
            typeId:'Test1234',
            creatureId:'Tes5678',
            description:'This is a Test',
            power:'99',
            toughness:'99'
        })
        //test
        expect(res.status).toEqual(400);
    })
    //Test 3
    it('Should Find a card by cardName', async () => {
        //Create a Card
        const res = await request(app).post('/cards')
        .send({
            cardName:'Test',
            manaCost:'99',
            color:'Red',
            rarity:'Common',
            typeId:'Test1234',
            creatureId:'Tes5678',
            abilityId:'Test9101',
            description:'This is a Test',
            power:'99',
            toughness:'99'
        })
        const find = await request(app).get('/cards/Test');
        //test
        expect(res.status).toEqual(200);
    })
    //Test 4
    it('Should not find a card by cardName', async () => {
        const res = await request(app).post('/cards')
        .send({
            cardName:'Test',
            manaCost:'99',
            color:'Red',
            rarity:'Common',
            typeId:'Test1234',
            creatureId:'Tes5678',
            abilityId:'Test9101',
            description:'This is a Test',
            power:'99',
            toughness:'99'
        })
        //look for ability that is not there
        const find = await request(app).get('/cards/Fail');
        //test
        expect(find.status).toEqual(400);
    })
      //Test 5
      it('Should not find a card by cardName', async () => {
        //look for ability that is not there
        const find = await request(app).get('/cards/Test');
        //test
        expect(find.status).toEqual(400);
    })
    //Test 6
    it('Should update a card by its cardName', async () =>{
          //Create a Card
          const res = await request(app).post('/cards')
          .send({
              cardName:'Test',
              manaCost:'99',
              color:'Red',
              rarity:'Common',
              typeId:'Test1234',
              creatureId:'Tes5678',
              abilityId:'Test9101',
              description:'This is a Test',
              power:'99',
              toughness:'99'
          })
          //update card
          const find = await request(app).put('/cards/Test')
          .send({
            cardName:'Test',
            manaCost:'99',
            color:'Blue',
            rarity:'Uncommon',
            typeId:'Test1234',
            creatureId:'Test5678',
            abilityId:'Test9101',
            description:'This is a Test',
            power:'99',
            toughness:'99'
          })
          expect(find.status).toEqual(200);
    })
    //Test 7
    it('Should not update a card by its cardName', async () =>{
        //Create a Card
        const res = await request(app).post('/cards')
        .send({
            cardName:'Test',
            manaCost:'99',
            color:'Red',
            rarity:'Common',
            typeId:'Test1234',
            creatureId:'Tes5678',
            abilityId:'Test9101',
            description:'This is a Test',
            power:'99',
            toughness:'99'
        })
        //update card
        const find = await request(app).put('/cards/Fail')
        .send({
          cardName:'Test',
          manaCost:'99',
          color:'Blue',
          rarity:'Uncommon',
          typeId:'Test1234',
          creatureId:'Test5678',
          abilityId:'Test9101',
          description:'This is a Test',
          power:'99',
          toughness:'99'
        })
        expect(find.status).toEqual(400);
  })
  //Teat 8
  it('Should not update a card by its cardName', async () =>{
       //update card
    const find = await request(app).put('/cards/Fail')
    .send({
      cardName:'Test',
      manaCost:'99',
      color:'Blue',
      rarity:'Uncommon',
      typeId:'Test1234',
      creatureId:'Test5678',
      abilityId:'Test9101',
      description:'This is a Test',
      power:'99',
      toughness:'99'
    })
    expect(find.status).toEqual(400);
})
  //Test 9
  it('Should delete a card by its cardName', async () =>{
    //Create a Card
    const res = await request(app).post('/cards')
    .send({
        cardName:'Test',
        manaCost:'99',
        color:'Red',
        rarity:'Common',
        typeId:'Test1234',
        creatureId:'Tes5678',
        abilityId:'Test9101',
        description:'This is a Test',
        power:'99',
        toughness:'99'
    })
    const deleteCard = await request(app).delete('/cards/Test')
    expect(deleteCard.status).toEqual(200);
    })
    //Test 10
    it('Should delete a card by its cardName', async () =>{
        const deleteCard = await request(app).delete('/cards/Test')
        expect(deleteCard.status).toEqual(400);
    })
    //Test 11
    it('Should get all the cards', async () => {
        const res = await request(app).get('/cards')
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