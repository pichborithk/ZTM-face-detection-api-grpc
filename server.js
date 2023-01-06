const express = require('express');
const cors = require('cors');
const knex = require('knex');

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

db.select('*').from('users').then(console.log);

const app = express();

app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: '001',
      name: 'John',
      email: 'john@gmail.com',
      password: 'password1',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '002',
      name: 'David',
      email: 'david@gmail.com',
      password: 'password2',
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  }
  res.status(400).json('error signin');
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((user) => res.json('Congratulation'))
    .catch((err) => res.status(400).json('Unable to register'));
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  database.users.forEach((user) => {
    if (user.id === id) {
      return res.json(user);
    }
  });
  res.status(400).json('no such user');
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
    .where({ id: id })
    .increment('entrie', 1)
    .returning('entrie')
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => res.status(400).json('fail'));
});

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
