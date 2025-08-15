import Joi from 'joi';
import postalCodes from 'postal-codes-js';

const postalCodeSchema = Joi.string()
  .min(3)
  .max(10)
  .custom((value, helpers) => {
    try {
      // Validate the postal code format
      const validation = postalCodes.validate(value);
      
      if (!validation) {
        return helpers.error('postalCode.invalid');
      }
      
      return value;
    } catch (error) {
      return helpers.error('postalCode.invalid');
    }
  }, 'Postal Code Validation')
  .messages({
    'postalCode.invalid': 'Invalid postal code format',
    'string.min': 'Postal code must be at least 3 characters long',
    'string.max': 'Postal code must not exceed 10 characters',
    'string.empty': 'Postal code is required'
  });

export default postalCodeSchema;