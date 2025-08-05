import Joi from 'joi';

const ERROR_MESSAGE_01 = `where_house_name must follow the format "where_house_" followed by a number (e.g., "where_house_0", "where_house_123")`;


// CREATE VALIDATOR - With defaults
const validateCompanyDetails = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }
  
  const schema = Joi.object({
    where_house_name: Joi.string()
      .pattern(/^where_house_\d+$/)
      .message(ERROR_MESSAGE_01)
      .required(),
    where_house_location: Joi.object({
        lat: Joi.number().min(-90).max(90).allow(null),
        lng: Joi.number().min(-180).max(180).allow(null),
    }).default({ lat: null, lng: null }),
    delivery_charge_for_1KM: Joi.number().positive().precision(2).default(0.01),
    service_charge: Joi.number().min(0).precision(2).default(0),
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
    where_house_name: Joi.string()
      .pattern(/^where_house_\d+$/)
      .message(ERROR_MESSAGE_01)
      .optional(),
    where_house_location: Joi.object({
        lat: Joi.number().min(-90).max(90).required(),
        lng: Joi.number().min(-180).max(180).required(),
    }).allow(null).optional(),
    delivery_charge_for_1KM: Joi.number().positive().precision(2).optional(),
    service_charge: Joi.number().min(0).precision(2).optional(),
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