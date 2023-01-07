const handleRegister = (req, res, db, bcrypt) => {
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
};

module.exports = { handleRegister: handleRegister };
