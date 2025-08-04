import Joi from 'joi';
import { optionalImageSchema, requiredImageSchema } from './imageValidationSchemas.js';

// CREATE VALIDATOR - With defaults
const validateOtherProduct = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }

    const schema = Joi.object({
        name: Joi.string().min(1).max(200).required(),
        description: Joi.string().min(1).max(500).required(),
        category_id: Joi.string().min(1).max(100).required(),
        main_image: requiredImageSchema,
        images: requiredImageSchema,
        
        weight: Joi.number().positive().optional(),
        
        // Pricing
        cost_price: Joi.number().positive().required(),
        marked_price: Joi.number().positive().required(),
        selling_price: Joi.number().positive().optional(),
        discount_percentage: Joi.number().min(0).max(100).required(),
        discount_amount: Joi.number().min(0).optional(),
        
        // Quantity management
        add_quantity: Joi.number().integer().min(0).default(0),
        withdraw_quantity: Joi.number().integer().min(0).default(0),
        stock_quantity: Joi.number().integer().min(0).positive().required(),
        
        stockHistory: Joi.array().items(Joi.string().max(150)).default([]),
        
        // Status flags
        is_active: Joi.boolean().default(true),
        is_in_stock: Joi.boolean().default(true),
        is_liquor: Joi.boolean().default(false),
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
const validateOtherProductUpdate = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }

  const schema = Joi.object({
    name: Joi.string().min(1).max(200).optional(),
    description: Joi.string().min(1).max(500).optional(),
    category_id: Joi.string().min(1).max(100).optional(),
    main_image: optionalImageSchema,
    images: optionalImageSchema,
    
    weight: Joi.number().positive().optional(),
    
    // Status flags
    is_active: Joi.boolean().optional(),
    is_in_stock: Joi.boolean().optional(),
    is_liquor: Joi.boolean().optional(),
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

// Additional validator for quantity operations (if needed separately)
const validateQuantityOperation = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }

  const schema = Joi.object({
    // Quantity management
    add_quantity: Joi.number().integer().min(0).optional(),
    withdraw_quantity: Joi.number().integer().min(0).optional(),
    //stock_quantity: Joi.number().integer().min(0).optional(),
  })
  .min(1) // Require at least one quantity field
  .options({ stripUnknown: true });

  const { error, value } = schema.validate(req.body, {
    allowUnknown: false,
    abortEarly: false
  });

  if (error) {
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

  req.body = value;
  next();
};

// Additional validator for quantity operations (if needed separately)
const validatePriceOperation = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }
  
  const schema = Joi.object({
    // Pricing
    cost_price: Joi.number().positive().optional(),
    marked_price: Joi.number().positive().optional(),
    discount_percentage: Joi.number().min(0).max(100).optional(),
  })
  .min(1) // Require at least one quantity field
  .options({ stripUnknown: true });

  const { error, value } = schema.validate(req.body, {
    allowUnknown: false,
    abortEarly: false
  });

  if (error) {
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

  req.body = value;
  next();
};

export { validateOtherProduct, validateOtherProductUpdate, validateQuantityOperation, validatePriceOperation};