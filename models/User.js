const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'No first name entered']
  },
  lastName: {
    type: String,
    required: [true, 'No last name entered']
  },
  email: {
    type: String,
    required: [true, 'No email entered'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Invalid email']
  },
  mobileNo: {
    type: String,
    // required: [true, 'No mobile entered']
  },
  password: {
    type: String,
    required: [true, 'No password entered'],
    minlength: [8, 'Min length error']
  }
});

userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  // console.log('saving', this);
  next();
})

// userSchema.post('save', function(user, next) {
//   console.log('saved', user);
//   next();
// })

// userSchema.statics.login = async(email, password) => {
//   console.log('login')
//   const user = await this.findOne({ email }); //this - the userModel
//   console.log(user);
//   if (user) {
//     let auth = await bcrypt.compare(password, user.password);
//     if (auth) {
//       return user;
//     } else {
//       console.log('passwd err')
//       throw Error('Invalid email or password');
//     }
//   } else {
//     console.log('email err')
//     throw Error('Invalid email or password');
//   }
// }

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;