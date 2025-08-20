import Joi from 'joi';
import postalCodeSchema from './schemas/postalCodeSchema.js';
import locationSchema from './schemas/locationSchema.js';

// CREATE VALIDATOR - With defaults
const validateSuperMarket = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }

  const schema = Joi.object({
    superMarket_Name: Joi.string().min(1).max(100).required(),

    // Location
    city: Joi.string().min(1).max(100).required(),
    state: Joi.string().min(1).max(100).required(),
    postalCode: postalCodeSchema.required(),
    country: Joi.string().min(2).max(100).required(),
    streetAddress: Joi.string().min(2).max(300).required(),
    location: locationSchema.required(),

    isActive: Joi.boolean().default(true),
    orders_count: Joi.number().integer().min(0).default(0),
  });

  // THE KEY CHANGE: Use the validated value with defaults applied
  const { error, value } = schema.validate(req.body, {
    allowUnknown: false,
    stripUnknown: true,
    abortEarly: false
  });

  if (error) {
    return res.status(400).json({ 
        success: false,
        message: error.details[0].message,
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        }))
    });
  }

  // Replace req.body with the validated value that includes defaults
  req.body = value;
  next();
};

// UPDATE VALIDATOR - NO defaults, all fields optional
const validateSuperMarketUpdate = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }
  
  const schema = Joi.object({
    superMarket_Name: Joi.string().min(1).max(100).optional(),

    // Location
    city: Joi.string().min(1).max(100).optional(),
    state: Joi.string().min(1).max(100).optional(),
    postalCode: postalCodeSchema.optional(),
    country: Joi.string().min(2).max(100).optional(),
    streetAddress: Joi.string().min(2).max(300).optional(),

    isActive: Joi.boolean().default(true),
  })
  .min(1) // Require at least one field to update
  .options({ stripUnknown: true });; 

  // THE KEY CHANGE: Use the validated value with defaults applied
  const { error, value } = schema.validate(req.body, {
    allowUnknown: false,
    abortEarly: false
  });

  if (error) {
    console.log("Validation error: " + error.details[0].message)
    return res.status(400).json({ 
        success: false,
        message: "Validation failed",
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        }))
    });
  }

  // Replace req.body with the validated value that includes defaults
  req.body = value;
  next();
};

export { validateSuperMarket, validateSuperMarketUpdate };