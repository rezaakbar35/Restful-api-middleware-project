const jwt = require('jsonwebtoken');

const signToken = (data) => {
  const token = jwt.sign(data, 'secretcode', { expiresIn: '1h' });
  return token;
};

const verifyToken = (token) => {
  const data = jwt.verify(token, 'secretcode');
  return data;
};

module.exports = { signToken, verifyToken };