const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: '26fabf9df0894e8e8ce59c8abf8955a6',
});

const handleApiCall = (req, res) => {
  app.models
    .predict('face-detection', req.body.input)
    .then((data) => res.json(data))
    .catch((err) => res.json('unable to work with API'));
};

const handleImage = (db) => (req, res) => {
  const { id } = req.body;
  db('users')
    .where({ id: id })
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => res.status(400).json('fail'));
};

module.exports = { handleImage: handleImage, handleApiCall: handleApiCall };
