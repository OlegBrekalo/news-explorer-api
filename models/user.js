const mongoose = require('mongoose');
const validatorLib = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: { unique: true, dropDups: true },
    validate: {
      validator(v) {
        return validatorLib.isEmail(v);
      },
      message: (props) => `${props.value} не является валидным Email`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('user', userSchema);
