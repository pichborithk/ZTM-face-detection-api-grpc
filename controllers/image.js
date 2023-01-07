const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');
// const Clarifai = require('clarifai');

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set('authorization', 'Key 26fabf9df0894e8e8ce59c8abf8955a6');

const handleApiCall = (req, res) => {
  stub.PostModelOutputs(
    {
      model_id: 'face-detection',
      inputs: [{ data: { image: { url: req.body.input } } }],
    },
    metadata,
    (err, response) => {
      if (err) {
        console.log('Error: ' + err);
        return;
      }
      if (response.status.code !== 10000) {
        console.log(
          'Received failed status: ' +
            response.status.description +
            '\n' +
            response.status.details
        );
        return;
      }
      res.json(response);
    }
  );
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
