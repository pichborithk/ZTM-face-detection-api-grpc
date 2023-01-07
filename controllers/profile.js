const handleProfile = (req, res, db) => {
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
};

module.exports = { handleProfile: handleProfile };
