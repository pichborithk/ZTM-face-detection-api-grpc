import express from 'express';
// const express = require('express');

const app = express();
app.use(express.json());

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
    res.json('success');
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

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
