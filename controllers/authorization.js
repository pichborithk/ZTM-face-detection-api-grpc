const redisClient = require('./signin').redisClient;

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(typeof authorization);
  if (!authorization) {
    console.log('1');
    return res.status(401).json('Unauthorized');
  }
  redisClient.get(authorization).then((reply) => {
    if (!reply) {
      console.log('2');
      return res.status(401).json('Unauthorized');
    }
    console.log('3');
    return next();
  });
};

module.exports = { requireAuth: requireAuth };
