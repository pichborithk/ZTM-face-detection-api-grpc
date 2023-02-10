const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcryptjs');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'pichborith',
    password: '',
    database: 'face-detection',
  },
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

app.post('/signin', signin.handleSignin(db, bcrypt));

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get('/profile/:id', (req, res) => {
  profile.handleProfile(req, res, db);
});

app.post('/imageUrl', image.handleApiCall);

app.put('/image', image.handleImage(db));

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
