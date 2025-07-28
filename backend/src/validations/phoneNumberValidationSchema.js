import Joi from 'joi';
import { parsePhoneNumber } from 'libphonenumber-js';

const phoneValidator = Joi.string().custom((value, helpers) => {
  try {
    const phoneNumber = parsePhoneNumber(value);
    if (!phoneNumber.isValid()) {
      return helpers.error('any.invalid');
    }
    return phoneNumber.format('E.164');
  } catch (error) {
    return helpers.error('any.invalid');
  }
});

export default phoneValidator;