import Joi from 'joi';

// CREATE VALIDATOR - With defaults
const validateAddress = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }

  const schema = Joi.object({
    city: Joi.string().min(1).max(100).required(),
    state: Joi.string().min(1).max(100).required(),
    postalCode: Joi.string().pattern(/^[A-Za-z0-9\s\-]{3,10}$/).required(),
    country: Joi.string().min(2).max(100).required(),
    streetAddress: Joi.string().min(2).max(300).required(),
    phoneNumber: Joi.string().pattern(/^\+\d{1,3}\d{4,14}$/).min(10).max(18).trim().default(null),

    latitude: Joi.number().min(-90).max(90).precision(6).optional(),
    longitude: Joi.number().min(-180).max(180).precision(6).optional(),
    
    fullName: Joi.string().min(1).max(100).default(''),
    buildingName: Joi.string().min(1).max(100).default(''),
    landmark: Joi.string().min(1).max(100).default(''),
    notes: Joi.string().min(1).max(100).default(''),

    isDefault: Joi.boolean().default(false),
    isActive: Joi.boolean().default(true),
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
const validateAddressUpdate = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }
  
  const schema = Joi.object({
    city: Joi.string().min(1).max(100).optional(),
    state: Joi.string().min(1).max(100).optional(),
    postalCode: Joi.string().pattern(/^[A-Za-z0-9\s\-]{3,10}$/).optional(),
    country: Joi.string().min(2).max(100).optional(),
    streetAddress: Joi.string().min(2).max(300).optional(),
    phoneNumber: Joi.string().pattern(/^\+\d{1,3}\d{4,14}$/).min(10).max(18).trim().optional(),

    latitude: Joi.number().min(-90).max(90).precision(6).optional(),
    longitude: Joi.number().min(-180).max(180).precision(6).optional(),
    
    fullName: Joi.string().min(1).max(100).optional(),
    buildingName: Joi.string().min(1).max(100).optional(),
    landmark: Joi.string().min(1).max(100).optional(),
    notes: Joi.string().min(1).max(100).optional(),

    isDefault: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
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

export { validateAddress, validateAddressUpdate };