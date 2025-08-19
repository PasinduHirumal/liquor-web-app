import Joi from 'joi';

// UPDATE VALIDATOR - NO defaults, all fields optional
const validateAppInfoUpdate = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }
  
  const schema = Joi.object({
    description: Joi.string().min(1).max(100).optional(),
    app_version: Joi.number().positive().precision(6).optional(),
    is_liquor_show: Joi.boolean().optional(),
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

// UPDATE VALIDATOR - NO defaults, all fields optional
const validateLiquorActiveToggleUpdate = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }
  
  const schema = Joi.object({
    is_liquor_show: Joi.boolean().optional(),
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

export { validateAppInfoUpdate, validateLiquorActiveToggleUpdate };