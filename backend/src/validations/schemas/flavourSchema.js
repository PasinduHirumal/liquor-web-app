import Joi from 'joi';

const primaryFlavours = [
  'Sweet', 'Dry', 'Bitter', 'Smoky', 'Fruity', 'Spicy', 'Herbal', 
  'Woody', 'Floral', 'Earthy', 'Citrusy', 'Nutty', 'Creamy'
];
const finishTypes = ['Short', 'Medium', 'Long'];
const tastingProfiles = ['Light', 'Medium', 'Full-bodied', 'Complex', 'Smooth', 'Bold'];

const defaultFlavourValidations = Joi.object({
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
        sweetness_level: Joi.number().integer().min(1).max(10).default(0),
        bitterness_level: Joi.number().integer().min(1).max(10).default(0),
        smokiness_level: Joi.number().integer().min(1).max(10).default(0),
        finish_type: Joi.string().valid(...finishTypes).allow(null).default(null),
        finish_notes: Joi.array().items(
            Joi.string().min(1).max(50)
        ).min(0).max(5).default([]),
        tasting_profile: Joi.string().valid(...tastingProfiles).allow(null).default(null)
    }).required();

const optionalFlavourValidations = Joi.object({
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
      finish_type: Joi.string().valid(...finishTypes).allow(null).optional(),
      finish_notes: Joi.array().items(
        Joi.string().min(1).max(50)
      ).min(0).max(5).optional(),
      tasting_profile: Joi.string().valid(...tastingProfiles).allow(null).optional()
    }).optional();

export {defaultFlavourValidations, optionalFlavourValidations};