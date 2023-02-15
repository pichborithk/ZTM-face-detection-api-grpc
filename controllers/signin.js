const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient({ url: process.env.REDIS_URI });

// (async () => {
//   await redisClient.connect();
// })();

async function redisConnect() {
  return await redisClient.connect();
}
redisConnect();

function handleSignin(db, bcrypt, req, res) {
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
}

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  // return redisClient.get(authorization, (err, reply) => {
  //   console.log(reply);
  //   if (err || !reply) {
  //     return res.status(400).json('Unauthorized');
  //   }
  //   return res.json({ id: reply });
  // });
  return redisClient
    .get(authorization)
    .then((reply) => res.json({ id: reply }))
    .catch(console.log);
};

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, 'JWT_SECRET', { expiresIn: '2 days' });
};

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
};

const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return {
        success: 'true',
        userId: id,
        token,
      };
    })
    .catch(console.log);
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(req, res)
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
