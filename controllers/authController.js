const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

/** 
* UTILITY FUNCTIONS
*/

const handleErrors = (error) => {
  errorsFound = {email: '', password: ''};

  if (error.message.includes('user validation failed')) {
    Object.values(error.errors).forEach((item) => {
      errorsFound[item.properties.path] = item.properties.message
    })
  } else if (error.message.includes('duplicate key error')) {
    errorsFound['email'] = 'duplicate email';
  } else {
    errorsFound['others'] = true;
  }

  return errorsFound;
}

const maxAge = 24*60*60;
const generateToken = (id) => {
  //Need to change
  const secret = process.env.SECRET;
  const token = jwt.sign({id}, secret, {expiresIn: maxAge});
  return token;
}

/** 
* MIDDLEWARE FUNCTIONS
*/

const handleLogin = async(email, password) => {
  const user = await User.findOne({ email }); //this - the userModel
  
  if (user) {
    let auth = await bcrypt.compare(password, user.password);
    // console.log('auth', auth)
    if (auth) {
      return user;
    } else {
      throw Error('Invalid email or password');
    }
  } else {
    throw Error('Invalid email or password');
  }
}

// const signupGet = (req, res) => {
//   console.log('Singnup GET');
//   res.send({data: 'Signup'});
// }

const signupPost = async (req, res) => {
  const dataReceived = req.body;
  // let valid = await (emailValidator.validate(data.email));
  // console.log(valid);
  if (false /*!valid.valid*/) {
    res.status(400).json(valid);
  } else {

    const data = {...dataReceived}
    console.log(data);
  try {
    const user = await User.create(data);
    // console.log(user);
    const token = generateToken(user._id);
    // res.cookie('jwt', token);
    res.cookie('jwt', token, {httpOnly: true});
    res.status(201).json({message: 'Success', email:user.email});
  } catch (error) {
    console.log(error);
    let errorsFound = handleErrors(error);
    if (errorsFound.others) {
      res.status(500).json({message: 'Internal Server Error'});
    } else {
      res.status(400).json(errorsFound);
    }
  }
}
}

const loginPost = async (req, res) => {
  data = req.body;
  const {email, password} = data;
  try {
    const user = await handleLogin(email, password);
    const token = generateToken(user._id);
    // res.cookie('jwt', token);
    res.cookie('jwt', token, {httpOnly: true});
    res.status(200).json({message: 'Success', email: user.email});
  } catch (error) {
    console.log(error.message);
    res.status(401).json({message: error.message});
  }
}

const logoutGet = (req, res) => {
  res.cookie('jwt', '', {maxAge: 1});
  // console.log('logout hit');
  res.status(200).json({message: 'Success'});
}

const changePasswordPut = async (req, res) => {
  let {oldPassword, newPassword} = req.body;
  console.log('change password')

  let token = req.cookies.jwt;
  const secret = process.env.SECRET;

  var userEmail = undefined; 
  if(token) {
    jwt.verify(token, secret, async (err, decodedToken) => {
      if(err) {
        res.status(403).json({message: 'Log in first'});
      } else {
        userEmail = await User.findById(decodedToken.id);
      }
    })
  } else {
    res.status(403).json({message: 'Log in first'});
  }

  if (userEmail) {
  const user = await User.findOne({ userEmail }); //this - the userModel
  if (user) {
    let auth = await bcrypt.compare(oldPassword, user.password);
    if (auth) {
      res.status(200).json({message: 'ok'});
    } else {
      res.status(403).json({message: 'wrong password'});
    }
  } else {
    res.status(403).json({message: 'login first'});
  }
}

}

module.exports = {signupPost, loginPost, logoutGet, changePasswordPut};