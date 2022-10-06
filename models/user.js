const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: validator.isEmail,
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // hide password
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});
userSchema.methods.toJSON = function () {
  const editedUser = this.toObject();
  delete editedUser.password;
  return editedUser;
};

module.exports = mongoose.model('user', userSchema);
