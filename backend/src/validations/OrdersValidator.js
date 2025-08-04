import Joi from 'joi';
import ORDER_STATUS from "../enums/orderStatus.js";

// UPDATE VALIDATOR - NO defaults, all fields optional
const validateOrderStatusUpdate = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }

  const schema = Joi.object({
    //status: Joi.string().valid(...Object.values(ORDER_STATUS)).optional(),
    status: Joi.string().valid(ORDER_STATUS.PENDING, ORDER_STATUS.PROCESSING).optional(),
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
const validateOrderAssignedDriverUpdate = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }
  
  const schema = Joi.object({
    assigned_driver_id: Joi.string().min(1).max(100).optional(),
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

export { validateOrderStatusUpdate, validateOrderAssignedDriverUpdate };