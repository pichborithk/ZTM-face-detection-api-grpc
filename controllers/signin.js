const jwt = require('jsonwebtoken');
const redis = require('redis');

(async () => {
  const redisClient = redis.createClient({ url: process.env.REDIS_URI });

  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect();
  await redisClient.set('key', 'value');
  const value = await redisClient.get('key');
  console.log(value);
  // await client.disconnect();
})();

const handleSignin = (db, bcrypt, req, res) => {
  if (!req.body.email || !req.body.password) {
    return Promise.reject('incorrect form submission');
  }
  return (
    db
      .select('email', 'hash')
      .from('login')
      .where({ email: req.body.email })
      // .where('email', '=', req.body.email)
      .then((data) => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid) {
          return db
            .select('*')
            .from('users')
            .where({ email: req.body.email })
            .then((data) => data[0])
            .catch((err) => Promise.reject('unable to get user'));
        } else {
          Promise.reject('Wrong credentials');
        }
      })
      .catch((err) => Promise.reject('Wrong credentials'))
  );
};

const getAuthTokenId = () => {
  console.log('Auth Ok');
};

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, 'JWT_SECRET', { expiresIn: '2 days' });
};

const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return { success: 'true', userId: id, token };
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId
    : handleSignin(db, bcrypt, req, res)
        .then((data) => {
          return data.id && data.email
            ? createSession(data)
            : Promise.reject('Wrong credentials');
        })
        .then((session) => res.json(session))
        .catch((err) => res.status(400).json(err));
};

module.exports = { signinAuthentication: signinAuthentication };
