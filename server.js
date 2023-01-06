const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcryptjs');

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

app.post('/signin', (req, res) => {
  db.select('email', 'hash')
    .from('login')
    .where({ email: req.body.email })
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where({ email: req.body.email })
          .then((data) => res.json(data[0]))
          .catch((err) => res.status(400).json('err 1'));
      } else {
        res.status(400).json('err 2');
      }
    })
    .catch((err) => res.status(400).json('err 3'));
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  db.transaction((trx) => {
    trx('users')
      .insert({
        email: email,
        name: name,
        joined: new Date(),
      })
      .returning('email')
      .then((data) => {
        return trx
          .insert({
            email: data[0].email,
            hash: hash,
          })
          .into('login')
          .returning('*')
          .then((data) => res.json(data[0]))
          .catch((err) => res.status(400).json('Unable to register (1)'));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json('Unable to register (2)'));
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({ id: id })
    .then((data) => {
      if (data.length) {
        res.json(data);
      } else {
        res.status(400).json('Not found');
      }
    })
    .catch((err) => res.status(400).json('error getting user'));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
    .where({ id: id })
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => res.status(400).json('fail'));
});

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
