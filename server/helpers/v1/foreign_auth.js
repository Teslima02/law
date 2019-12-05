const Channel = require('../../models/v1/channel');

function getToken(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    // Authorization: Bearer g1jipjgi1ifjioj
    // Handle token presented as a Bearer token in the Authorization header
    return req.headers.authorization.split(' ')[1];
  }
  if (req.query && req.query.token) {
    // Handle token presented as URI param
    return req.query.token;
  }
  if (req.cookies && req.cookies.token) {
    // Handle token presented as a cookie parameter
    return req.cookies.token;
  }
  // If we return null, we couldn't find a token.
  // In this case, the JWT middleware will return a 401 (unauthorized) to the client for this request
  return null;
}

const foreignAuth = (req, res, next) => {
  Channel.findOne({ secret: getToken(req) }, (err, channel) => {
    if (err) {
      res.status(500).json({ message: 'Server error, please try again!' });
      return;
    }
    if (!channel) {
      res.status(401).json({ message: 'Unauthorized token!' });
      return;
    }
    req.channel = channel;
    // TODO: log transaction
    next();
  });
};

module.exports = foreignAuth;
