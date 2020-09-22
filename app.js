

// load modules
const express = require('express');
const morgan = require('morgan');
const usersRoutes = require('./routes/users');
const coursesRoutes = require('./routes/courses');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const indexModels = require('./models/index');




// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();
app.use(express.json());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// TODO setup your api routes here



// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

app.use('/api/users', usersRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/index', indexRoutes);
app.use('/api/auth', authRoutes);

const db = require("./models");

//test the connection to the database
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
})();



// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'No Routes Matched',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);


  const server = app.listen(app.get('port'), () => {
    console.log(`Express server is listening on port ${server.address().port}`);
});




