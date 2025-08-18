import Joi from 'joi';
import iso31661 from 'iso-3166-1';


export const isValidCountry = (value) => {
  if (!value || typeof value !== 'string') return false;
  
  // Check if it's a valid country name
  const byName = iso31661.whereCountry(value);
  
  // Check if it's a valid 2-letter code (US, UK, etc.)
  const byAlpha2 = iso31661.whereAlpha2(value);
  
  // Check if it's a valid 3-letter code (USA, GBR, etc.)
  const byAlpha3 = iso31661.whereAlpha3(value);
  
  return !!(byName || byAlpha2 || byAlpha3);
};

export const getCountryInfo = (value) => {
  return iso31661.whereCountry(value) || 
         iso31661.whereAlpha2(value) || 
         iso31661.whereAlpha3(value) || 
         null;
};

export const joiCountryValidator = (value, helpers) => {
  if (!isValidCountry(value)) {
    return helpers.error('country.invalid');
  }
  return value;
};

// Pre-built Joi schema for country validation
export const countrySchema = Joi.string()
  .min(1)
  .max(200)
  .custom(joiCountryValidator, 'country validation')
  .messages({
    'country.invalid': 'Please provide a valid country name or ISO code (e.g., "United States of America", "US", or "USA")'
  });