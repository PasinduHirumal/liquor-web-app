import Joi from 'joi';
import locationSchema from './schemas/locationSchema.js';

// CREATE VALIDATOR - With defaults
const validateCompanyDetails = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }
  
  const schema = Joi.object({
    where_house_name: Joi.string().min(1).max(100).required(),
    //where_house_location: locationSchema.default({ lat: null, lng: null }),
    where_house_location: locationSchema.required(),
    address: Joi.string().min(2).max(350).required(),
    delivery_charge_for_1KM: Joi.number().positive().precision(2).default(0.01),
    service_charge: Joi.number().min(0).max(100).precision(2).default(0),
    isLiquorActive: Joi.boolean().default(true),
    isActive: Joi.boolean().default(true),
  })
  .min(1) // Require at least one field to update
  .options({ stripUnknown: true });

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

// UPDATE VALIDATOR - NO defaults, all fields optional
const validateCompanyDetailsUpdate = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }
  
  const schema = Joi.object({
    //where_house_code: Joi.string().optional(),
    where_house_name: Joi.string().min(1).max(100).optional(),
    where_house_location: locationSchema.optional(),
    address: Joi.string().min(1).max(350).optional(),
    delivery_charge_for_1KM: Joi.number().positive().precision(2).optional(),
    service_charge: Joi.number().min(0).precision(2).optional(),
    isLiquorActive: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
  })
  .min(1) // Require at least one field to update
  .options({ stripUnknown: true });

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

export { validateCompanyDetails, validateCompanyDetailsUpdate };