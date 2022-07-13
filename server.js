const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')

//SWAGGER
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const swaggerOption = {
    swaggerDefiniation: {
        info: {
            title: 'CSE 341 Personal Project',
            description: 'An API for tracking survey orders for meat deparment and produce department.',
            contact:{
                name: "Christopher Bowen"
            },
            server: ["https://cse341-personalproject-cwbowen.herokuapp.com/"]
        }
    },
    apis: ['.routes/*.js']    
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// load config
dotenv.config({ path: './config/config.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

const app = express();

// // Logging
// if (process.env.NODE_ENV === 'development'){
//   app.use(morgan('dev'))
// }

// Handlebars
app.engine('.hbs', exphbs.engine({defaultLayout: 'main', extname: '.hbs',}))
app.set('view engine', '.hbs')

// Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGODB_URI,}),
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())


//static folder
app.use(express.static(path.join(__dirname, 'public')))



app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Connected and listening on ${port}`);
});