const express = require('express');
const routes = express.Router();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-auto.json');

const { ensureAuth, ensureGuest } = require('../middleware/auth')

// @desc    Login/Landing page
// @route   GET /
routes.get('/',ensureGuest, (req, res) => {
    res.render('login', {
      layout: 'login',
    })
  })


routes.use('/', require('./swagger'));
routes.use('/cards', require('./cards'));
routes.use('/decks', require('./decks'));
routes.use('/types', require('./types'));
routes.use('/creatures', require('./creatures'));
routes.use('/abilities', require('./abilities'));

routes.get('/', (req,res) =>{
    res.send('This is index');
})

module.exports = routes;