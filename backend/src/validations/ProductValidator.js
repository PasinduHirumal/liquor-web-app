import Joi from 'joi';
import { optionalImageSchema, requiredImageSchema } from './imageValidationSchemas.js';

const primaryFlavours = [
  'Sweet', 'Dry', 'Bitter', 'Smoky', 'Fruity', 'Spicy', 'Herbal', 
  'Woody', 'Floral', 'Earthy', 'Citrusy', 'Nutty', 'Creamy'
];
const finishTypes = ['Short', 'Medium', 'Long'];
const tastingProfiles = ['Light', 'Medium', 'Full-bodied', 'Complex', 'Smooth', 'Bold'];

// CREATE VALIDATOR - With defaults
const validateProduct = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }

  const schema = Joi.object({
    name: Joi.string().min(1).max(200).required(),
    description: Joi.string().min(1).max(1000).required(),
    category_id: Joi.string().min(1).max(1000).required(),
    brand: Joi.string().min(1).max(100).required(),
    alcohol_content: Joi.number().min(0).max(100).required(),
    volume: Joi.number().positive().required(),
    country: Joi.string().min(1).max(200).required(),
    flavour: Joi.object({
      primary_flavour: Joi.string().valid(...primaryFlavours).required(),
      flavour_notes: Joi.array().items(
        Joi.string().min(1).max(50)
      ).min(0).max(15).default([]),
      fruit_flavours: Joi.array().items(
        Joi.string().min(1).max(50)
      ).min(0).max(10).default([]),
      spice_flavours: Joi.array().items(
        Joi.string().min(1).max(50)
      ).min(0).max(10).default([]),
      herbal_flavours: Joi.array().items(
        Joi.string().min(1).max(50)
      ).min(0).max(10).default([]),
      wood_flavours: Joi.array().items(
        Joi.string().min(1).max(50)
      ).min(0).max(10).default([]),
      sweetness_level: Joi.number().integer().min(1).max(10).default(null),
      bitterness_level: Joi.number().integer().min(1).max(10).default(null),
      smokiness_level: Joi.number().integer().min(1).max(10).default(null),
      finish_type: Joi.string().valid(...finishTypes).default(null),
      finish_notes: Joi.array().items(
        Joi.string().min(1).max(50)
      ).min(0).max(5).default([]),
      tasting_profile: Joi.string().valid(...tastingProfiles).default(null)
    }).required(),
    main_image: requiredImageSchema,
    images: requiredImageSchema,

    // Pricing
    superMarket_id: Joi.string().min(1).max(200).allow(null).default(null),
    cost_price: Joi.number().positive().required(),
    marked_price: Joi.number().positive().required(),
    selling_price: Joi.number().positive().optional(),
    discount_percentage: Joi.number().min(0).max(100).required(),
    discount_amount: Joi.number().min(0).optional(),
    
    add_quantity: Joi.number().integer().min(0).default(0),
    withdraw_quantity: Joi.number().integer().min(0).default(0),
    stock_quantity: Joi.number().integer().min(0).positive().required(),
    
    stockHistory: Joi.array().items(Joi.string().max(150)).default([]),

    is_active: Joi.boolean().default(true),
    is_in_stock: Joi.boolean().default(true),
    is_liquor: Joi.boolean().default(true),
    
    created_at: Joi.date().iso().default(() => new Date().toISOString()),
    updated_at: Joi.date().iso().default(() => new Date().toISOString()),
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
const validateProductUpdate = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }
  const schema = Joi.object({
    name: Joi.string().min(1).max(200).optional(),
    description: Joi.string().min(1).max(1000).optional(),
    category_id: Joi.string().min(1).max(1000).optional(),
    brand: Joi.string().min(1).max(100).optional(),
    alcohol_content: Joi.number().min(0).max(100).optional(),
    volume: Joi.number().positive().optional(),
    country: Joi.string().min(1).max(200).optional(),
    flavour: Joi.object({
      primary_flavour: Joi.string().valid(...primaryFlavours).optional(),
      flavour_notes: Joi.array().items(
        Joi.string().min(1).max(50)
      ).min(0).max(15).optional(),
      fruit_flavours: Joi.array().items(
        Joi.string().min(1).max(50)
      ).min(0).max(10).optional(),
      spice_flavours: Joi.array().items(
        Joi.string().min(1).max(50)
      ).min(0).max(10).optional(),
      herbal_flavours: Joi.array().items(
        Joi.string().min(1).max(50)
      ).min(0).max(10).optional(),
      wood_flavours: Joi.array().items(
        Joi.string().min(1).max(50)
      ).min(0).max(10).optional(),
      sweetness_level: Joi.number().integer().min(1).max(10).optional(),
      bitterness_level: Joi.number().integer().min(1).max(10).optional(),
      smokiness_level: Joi.number().integer().min(1).max(10).optional(),
      finish_type: Joi.string().valid(...finishTypes).optional(),
      finish_notes: Joi.array().items(
        Joi.string().min(1).max(50)
      ).min(0).max(5).optional(),
      tasting_profile: Joi.string().valid(...tastingProfiles).optional()
    }).optional(),
    main_image: optionalImageSchema,
    images: optionalImageSchema,
    
    is_active: Joi.boolean().optional(),
    is_in_stock: Joi.boolean().optional(),
    is_liquor: Joi.boolean().optional(),
    
    updated_at: Joi.date().iso().default(() => new Date().toISOString()),
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

// INVENTORY UPDATE VALIDATOR - Specific for stock operations
const validateInventoryUpdate = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }

  const schema = Joi.object({
    add_quantity: Joi.number().integer().min(0).optional(),
    withdraw_quantity: Joi.number().integer().min(0).optional(),
    //stock_quantity: Joi.number().integer().min(0).optional(),
    
    updated_at: Joi.date().iso().default(() => new Date().toISOString()),
  })
  .min(1) // Require at least one field to update
  .options({ stripUnknown: true });

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
    superMarket_id: Joi.string().min(1).max(200).optional(),
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

// UPDATE VALIDATOR - NO defaults, all fields optional
const validateProductActiveToggleUpdate = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }

  const schema = Joi.object({
    is_active: Joi.boolean().optional(),
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

export { validateProduct, validateProductUpdate, validateInventoryUpdate, validatePriceOperation, validateProductActiveToggleUpdate };