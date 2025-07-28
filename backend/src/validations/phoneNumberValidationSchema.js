import Joi from 'joi';
import { PhoneNumber } from 'libphonenumber-js';

const phoneValidator = Joi.string().custom((value, helpers) => {
  try {
    const phoneNumber = new PhoneNumber(value);
    if (!phoneNumber.isValid()) {
      return helpers.error('any.invalid');
    }
    return phoneNumber.format('E.164');
  } catch (error) {
    return helpers.error('any.invalid');
  }
});

export default phoneValidator;