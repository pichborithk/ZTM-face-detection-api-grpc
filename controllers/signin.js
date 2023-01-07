const handleSignin = (db, bcrypt) => (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json('incorrect form submission');
  }
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
};

module.exports = { handleSignin: handleSignin };
