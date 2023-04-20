const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const secret = process.env.SECRET;

module.exports.isAuthenticated = (req, res, next) => {
  let token = req.cookies.jwt;

  if(token) {
    jwt.verify(token, secret, async (err, decodedToken) => {
      if(err) {
        res.status(403).send('Log in first');
      } else {
        let user = await User.findById(decodedToken.id);
        if (user == null) {
          res.cookie('jwt', '', {maxAge: 1});
          res.status(400).json({message: 'Invalid Token'});
        } else {
        req.user = {};
        req.user.id = user._id.toString();
      }
        next();
      }
    })
  } else {
    console.log('no token');
    res.status(403).send(JSON.stringify({'err':'Log in first'}));
  }
}