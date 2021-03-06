const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'MTG Cards Database',
    description: "<a id='logout' href='http://cse341-mtg-database.herokuapp.com/auth/logout'>Logout</a>",
  },

  host: 'cse341-mtg-database.herokuapp.com',
  schemes: ['http','https'],
  securityDefinitions: {  
    JWT:{  
      type: 'apiKey',  
      in: 'header',  
      name: 'auth-token'
    }
  }
};

const outputFile = './swagger-auto.json';
const endpointsFiles = ['./routes/index.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... 
   
description: "<a id='logout' href='http://cse341-mtg-database.herokuapp.com/auth/logout'>Logout</a>",

description: "<a id='logout' href='http://localhost:8080/auth/logout'>Logout</a>",


  host: 'cse341-mtg-database.herokuapp.com',
  schemes: ['http'],


  host: 'localhost:8080',
  schemes: ['http'],
*/

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./server.js');
});