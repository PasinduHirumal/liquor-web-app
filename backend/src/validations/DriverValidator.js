import Joi from 'joi';
import { defaultNullImageSchema, optionalImageSchema } from './imageValidationSchemas.js';
import phoneValidator from './phoneNumberValidationSchema.js';
import nicValidator from './nicValidationSchema.js';
import BACKGROUND_STATUS from '../enums/driverBackgroundStatus.js';
import DELIVERY_VEHICLES from '../enums/deliveryVehicles.js';

// CREATE VALIDATOR - With defaults
const validateDriver = (req, res, next) => {
  const schema = Joi.object({
    // Personal Information
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).max(128).optional(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: phoneValidator.required(),
    nic_number: nicValidator.required(),
    license_number: Joi.string().min(5).max(50).required(),
    dateOfBirth: Joi.alternatives().try(
      Joi.date(),
      Joi.string().isoDate(),
      Joi.valid(null)
    ).required(),
    profileImage: optionalImageSchema,
    address: Joi.string().max(350).allow('').default(null),
    city: Joi.string().max(100).allow('').default(null),
    emergencyContact: Joi.string().pattern(/^\+\d{1,3}\d{4,14}$/).allow('').default(null),

    // Vehicle Information
    vehicleType: Joi.string().valid(...Object.values(DELIVERY_VEHICLES)).default(null),
    vehicleModel: Joi.string().max(100).allow('').default(null),
    vehicleNumber: Joi.string().max(50).allow('').default(null),
    vehicleColor: Joi.string().max(50).allow('').default(null),
    vehicleYear: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).default(null),
    vehicleInsurance: Joi.string().allow('').default(null),
    vehicleRegistration: Joi.string().allow('').default(null),

    // Account & Status
    role: Joi.string().valid('driver').default('driver'),
    googleId: Joi.string().allow('').default(''),
    isAvailable: Joi.boolean().default(false),
    isActive: Joi.boolean().default(true),
    isOnline: Joi.boolean().default(false),
    isDocumentVerified: Joi.boolean().default(false),
    backgroundCheckStatus: Joi.string().valid(...Object.values(BACKGROUND_STATUS)).default(BACKGROUND_STATUS.PENDING),

    // Location & Delivery
    currentLocation: Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lng: Joi.number().min(-180).max(180).required(),
      timestamp: Joi.alternatives().try(
        Joi.date(),
        Joi.string().isoDate()
      ).default(() => new Date().toISOString())
    }).allow(null).default(null),
    deliveryZones: Joi.array().items(Joi.string()).default([]),
    workingHours: Joi.object({
      monday: Joi.object({
        start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isWorking: Joi.boolean().default(true)
      }).optional(),
      tuesday: Joi.object({
        start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isWorking: Joi.boolean().default(true)
      }).optional(),
      wednesday: Joi.object({
        start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isWorking: Joi.boolean().default(true)
      }).optional(),
      thursday: Joi.object({
        start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isWorking: Joi.boolean().default(true)
      }).optional(),
      friday: Joi.object({
        start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isWorking: Joi.boolean().default(true)
      }).optional(),
      saturday: Joi.object({
        start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isWorking: Joi.boolean().default(true)
      }).optional(),
      sunday: Joi.object({
        start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isWorking: Joi.boolean().default(true)
      }).optional()
    }).allow(null).default(null),
    maxDeliveryRadius: Joi.number().min(1).max(100).default(10),
    preferredDeliveryTypes: Joi.array().items(
      Joi.string().valid('food', 'grocery', 'pharmacy', 'electronics', 'documents', 'liquor', 'other')
    ).default(['liquor']),

    // Performance & Ratings
    rating: Joi.number().min(0).max(5).default(0),
    totalRatings: Joi.number().integer().min(0).default(0),
    totalDeliveries: Joi.number().integer().min(0).default(0),
    completedDeliveries: Joi.number().integer().min(0).default(0),
    cancelledDeliveries: Joi.number().integer().min(0).default(0),
    averageDeliveryTime: Joi.number().min(0).default(0),
    onTimeDeliveryRate: Joi.number().min(0).max(100).default(0),
    ordersHistory: Joi.array().items(Joi.string()).default([]),

    // Financial
    bankAccountNumber: Joi.string().min(5).max(50).allow('').default(null),
    bankName: Joi.string().max(100).allow('').default(null),
    bankBranch: Joi.string().max(100).allow('').default(null),
    taxId: Joi.string().max(50).allow('').default(null),
    commissionRate: Joi.number().min(0).max(1).default(0.15), // percentage
    totalEarnings: Joi.number().min(0).default(0),
    currentBalance: Joi.number().min(0).default(0),
    paymentMethod: Joi.string().valid('bank_transfer', 'mobile_money', 'cash', 'digital_wallet').default('bank_transfer'),

    // Documents
    documents: Joi.object({
      licenseImage: defaultNullImageSchema,
      nicImage: defaultNullImageSchema,
      vehicleRegistrationImage: defaultNullImageSchema,
      insuranceImage: defaultNullImageSchema,
      bankStatementImage: defaultNullImageSchema,
    }).default({
      licenseImage: null,
      nicImage: null,
      vehicleRegistrationImage: null,
      insuranceImage: null,
      bankStatementImage: null
    }),

    // Verification & Security
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
    deviceTokens: Joi.array().items(Joi.string()).default([]),
    lastLoginAt: Joi.alternatives().try(
      Joi.date(),
      Joi.string().isoDate(),
      Joi.valid(null)
    ).default(null),

  });

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

  req.body = value;
  next();
};

// UPDATE VALIDATOR - NO defaults, all fields optional
const validateDriverUpdate = (req, res, next) => {
  const schema = Joi.object({
    // Personal Information
    email: Joi.string().email().lowercase().optional(),
    password: Joi.string().min(6).max(128).optional(),
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    phone: phoneValidator.optional(),
    nic_number: nicValidator.optional(),
    license_number: Joi.string().min(5).max(50).optional(),
    dateOfBirth: Joi.alternatives().try(
      Joi.date(),
      Joi.string().isoDate(),
      Joi.valid(null)
    ).optional(),
    profileImage: optionalImageSchema,
    address: Joi.string().max(350).allow('').optional(),
    city: Joi.string().max(100).allow('').optional(),
    emergencyContact: Joi.string().pattern(/^\+\d{1,3}\d{4,14}$/).allow('').optional(),

    // Account & Status
    role: Joi.string().valid('driver').optional(),
    googleId: Joi.string().allow('').optional(),
    isAvailable: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
    isOnline: Joi.boolean().optional(),
    isDocumentVerified: Joi.boolean().optional(),
    backgroundCheckStatus: Joi.string().valid(...Object.values(BACKGROUND_STATUS)).optional(),

    // Verification & Security
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
    deviceTokens: Joi.array().items(Joi.string()).optional(),
    lastLoginAt: Joi.alternatives().try(
      Joi.date(),
      Joi.string().isoDate(),
      Joi.valid(null)
    ).optional(),

  })
  .min(1) // Require at least one field to update
  .options({ stripUnknown: true });

  const { error, value } = schema.validate(req.body, {
    allowUnknown: false,
    abortEarly: false
  });

  if (error) {
    console.log("Validation error: " + error.details[0].message);
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

// Additional validator for vehicle information updates
const validateVehicleInformationUpdate = (req, res, next) => {
  const schema = Joi.object({
    // Vehicle Information
    vehicleType: Joi.string().valid(...Object.values(DELIVERY_VEHICLES)).optional(),
    vehicleModel: Joi.string().max(100).allow('').optional(),
    vehicleNumber: Joi.string().max(50).allow('').optional(),
    vehicleColor: Joi.string().max(50).allow('').optional(),
    vehicleYear: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).optional(),
    vehicleInsurance: Joi.string().allow('').optional(),
    vehicleRegistration: Joi.string().allow('').optional(),
  })
  .min(1) // Require at least one field to update
  .options({ stripUnknown: true });

  const { error, value } = schema.validate(req.body, {
    allowUnknown: false,
    abortEarly: false
  });

  if (error) {
    console.log("Validation error: " + error.details[0].message);
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

// Additional validator for location and delivery updates
const validateLocationAndDeliveryUpdate = (req, res, next) => {
  const schema = Joi.object({
    // Location & Delivery
    currentLocation: Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lng: Joi.number().min(-180).max(180).required(),
      timestamp: Joi.alternatives().try(
        Joi.date(),
        Joi.string().isoDate()
      ).optional()
    }).allow(null).optional(),
    deliveryZones: Joi.array().items(Joi.string()).optional(),
    workingHours: Joi.object({
      monday: Joi.object({
        start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isWorking: Joi.boolean()
      }).optional(),
      tuesday: Joi.object({
        start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isWorking: Joi.boolean()
      }).optional(),
      wednesday: Joi.object({
        start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isWorking: Joi.boolean()
      }).optional(),
      thursday: Joi.object({
        start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isWorking: Joi.boolean()
      }).optional(),
      friday: Joi.object({
        start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isWorking: Joi.boolean()
      }).optional(),
      saturday: Joi.object({
        start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isWorking: Joi.boolean()
      }).optional(),
      sunday: Joi.object({
        start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isWorking: Joi.boolean()
      }).optional()
    }).allow(null).optional(),
    maxDeliveryRadius: Joi.number().min(1).max(100).optional(),
    preferredDeliveryTypes: Joi.array().items(
      Joi.string().valid('food', 'grocery', 'pharmacy', 'electronics', 'documents', 'other')
    ).optional(),
  })
  .min(1) // Require at least one field to update
  .options({ stripUnknown: true });

  const { error, value } = schema.validate(req.body, {
    allowUnknown: false,
    abortEarly: false
  });

  if (error) {
    console.log("Validation error: " + error.details[0].message);
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

// Additional validator for performance and rating updates
const validatePerformanceAndRatingUpdate = (req, res, next) => {
  const schema = Joi.object({
    // Performance & Ratings
    rating: Joi.number().min(0).max(5).optional(),
    totalRatings: Joi.number().integer().min(0).optional(),
    totalDeliveries: Joi.number().integer().min(0).optional(),
    completedDeliveries: Joi.number().integer().min(0).optional(),
    cancelledDeliveries: Joi.number().integer().min(0).optional(),
    averageDeliveryTime: Joi.number().min(0).optional(),
    onTimeDeliveryRate: Joi.number().min(0).max(100).optional(),
    ordersHistory: Joi.array().items(Joi.string()).optional(),
  })
  .min(1) // Require at least one field to update
  .options({ stripUnknown: true });

  const { error, value } = schema.validate(req.body, {
    allowUnknown: false,
    abortEarly: false
  });

  if (error) {
    console.log("Validation error: " + error.details[0].message);
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

// Additional validator for financial updates
const validateFinancialUpdate = (req, res, next) => {
  const schema = Joi.object({
    // Financial
    bankAccountNumber: Joi.string().min(5).max(50).allow('').optional(),
    bankName: Joi.string().max(100).allow('').optional(),
    bankBranch: Joi.string().max(100).allow('').optional(),
    taxId: Joi.string().max(50).allow('').optional(),
    commissionRate: Joi.number().min(0).max(1).optional(),
    totalEarnings: Joi.number().min(0).optional(),
    currentBalance: Joi.number().min(0).optional(),
    paymentMethod: Joi.string().valid('bank_transfer', 'mobile_money', 'cash', 'digital_wallet').optional(),
  })
  .min(1) // Require at least one field to update
  .options({ stripUnknown: true });

  const { error, value } = schema.validate(req.body, {
    allowUnknown: false,
    abortEarly: false
  });

  if (error) {
    console.log("Validation error: " + error.details[0].message);
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

// Additional validator for document updates
const validateDocumentUpdate = (req, res, next) => {
  const schema = Joi.object({
    // Documents
    documents: Joi.object({
      licenseImage: optionalImageSchema,
      nicImage: optionalImageSchema,
      vehicleRegistrationImage: optionalImageSchema,
      insuranceImage: optionalImageSchema,
      bankStatementImage: optionalImageSchema
    }).optional(),
  })
  .min(1) // Require at least one field to update
  .options({ stripUnknown: true });

  const { error, value } = schema.validate(req.body, {
    allowUnknown: false,
    abortEarly: false
  });

  if (error) {
    console.log("Validation error: " + error.details[0].message);
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

// Additional validator for driver qualifications updates
const validateQualificationsUpdate = (req, res, next) => {
  const schema = Joi.object({
    // Qualifications
    isActive: Joi.boolean().optional(),
    isAvailable: Joi.boolean().optional(),
    isAccountVerified: Joi.boolean().optional(),
    isDocumentVerified: Joi.boolean().optional(),
    backgroundCheckStatus: Joi.string().valid('pending', 'approved', 'rejected').optional(),
  })
  .min(1) // Require at least one field to update
  .options({ stripUnknown: true });

  const { error, value } = schema.validate(req.body, {
    allowUnknown: false,
    abortEarly: false
  });

  if (error) {
    console.log("Validation error: " + error.details[0].message);
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

export { 
  validateDriver, 
  validateDriverUpdate, 
  validateVehicleInformationUpdate, 
  validateLocationAndDeliveryUpdate,
  validatePerformanceAndRatingUpdate,
  validateFinancialUpdate,
  validateDocumentUpdate,
  validateQualificationsUpdate
};