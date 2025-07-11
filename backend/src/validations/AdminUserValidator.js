import Joi from 'joi';

// CREATE VALIDATOR - With defaults
const validateAdminUser = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).max(128).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^\+\d{1,3}\d{4,14}$/).min(10).max(18).trim().required(),
    
    role: Joi.string().valid('pending', 'admin', 'super_admin').default('pending'),
    googleId: Joi.string().allow('').default(''),
    isActive: Joi.boolean().default(true),
    isAdminAccepted: Joi.boolean().default(false),

    verifyOtp: Joi.string().allow('').default(''),
    verifyOtpExpiredAt: Joi.alternatives().try(
      Joi.date(),
      Joi.string().isoDate(),
      Joi.valid(null)
    ).default(null),
    isAccountVerified: Joi.boolean().default(false),
    resetOtp: Joi.string().allow('').default(''),
    resetOtpExpiredAt: Joi.alternatives().try(
      Joi.date(),
      Joi.string().isoDate(),
      Joi.valid(null)
    ).default(null),
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
const validateAdminUserUpdate = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().optional(),
    password: Joi.string().min(6).max(128).optional(),
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().pattern(/^(?:\+?\d{9,15})$/).min(9).trim().optional(),
    
    role: Joi.string().valid('customer', 'manager', 'owner').optional(),
    googleId: Joi.string().allow('').optional(),
    isActive: Joi.boolean().optional(),
    isAdminAccepted: Joi.boolean().optional(),
    
    verifyOtp: Joi.string().allow('').optional(),
    verifyOtpExpiredAt: Joi.alternatives().try(
      Joi.date(),
      Joi.string().isoDate(),
      Joi.valid(null)
    ).optional(),
    isAccountVerified: Joi.boolean().optional(),
    resetOtp: Joi.string().allow('').optional(),
    resetOtpExpiredAt: Joi.alternatives().try(
      Joi.date(),
      Joi.string().isoDate(),
      Joi.valid(null)
    ).optional(),
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




export { validateAdminUser, validateAdminUserUpdate };