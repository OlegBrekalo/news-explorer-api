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
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return validatorLib.isURL(v);
      },
      message: (props) => `${props.value} не является валидным URL`,
    },
  },
});

module.exports = mongoose.model('user', userSchema);
