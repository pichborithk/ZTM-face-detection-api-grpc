const express = require('express');
const cors = require('cors');

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
  database.users.push({
    id: '003',
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
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
  database.users.forEach((user) => {
    if (user.id === id) {
      user.entries++;
      return res.json(user.entries);
    }
  });
  res.status(400).json('no such user');
});

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
