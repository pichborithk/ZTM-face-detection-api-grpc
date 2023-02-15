const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcryptjs');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');

const db = knex({
  client: 'pg',
  // connection: {
  //   host: '127.0.0.1',
  //   port: 5432,
  //   user: 'pichborith',
  //   password: '',
  //   database: 'face-detection',
  // },
  connection: process.env.POSTGRES_URI,
});

const app = express();

app.use(express.json());
app.use(cors());

// app.get('/', (req, res) => {
//   res.send(db.users);
// });

app.get('/', (req, res) => {
  res.send('Really?');
});

app.post('/signin', signin.signinAuthentication(db, bcrypt));

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get('/profile/:id', auth.requireAuth, (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.post('/profile/:id', auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});

app.post('/imageUrl', auth.requireAuth, image.handleApiCall);

app.put('/image', auth.requireAuth, image.handleImage(db));

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
