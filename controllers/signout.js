const redisClient = require('./signin').redisClient;

const handleSignOut = (req, res) => {
  const { authorization } = req.headers;
  redisClient.del(authorization).then((reply) => {
    console.log('delete ok');
    console.log(reply);
    return reply;
  });
};

module.exports = { handleSignOut };
