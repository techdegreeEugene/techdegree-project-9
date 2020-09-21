

// load modules
const express = require('express');
const morgan = require('morgan');


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

app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/index', require('./routes/index'));
app.use('/api/auth', require('./routes/auth'));



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

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('DB connection successful');

//   })
//   .then(() => {
  const server = app.listen(app.get('port'), () => {
    console.log(`Express server is listening on port ${server.address().port}`);
});




