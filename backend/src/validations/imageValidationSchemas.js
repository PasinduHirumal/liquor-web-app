import Joi from 'joi';

// Common image validation schema for single or multiple images
export const imageSchema = Joi.alternatives().try(
    Joi.string().uri(),
    Joi.string().pattern(/^data:.*;base64,.*/),
    Joi.object({
        buffer: Joi.binary().required(),
        mimetype: Joi.string().valid(
            'image/jpeg', 
            'image/jpg', 
            'image/png', 
            'image/gif', 
            'image/webp'
        ).required(),
        originalname: Joi.string().required(),
        size: Joi.number().max(5 * 1024 * 1024).optional()
    }),
    Joi.array().items(
        Joi.alternatives().try(
            Joi.string().uri(),
            Joi.string().pattern(/^data:.*;base64,.*/),
            Joi.object({
                buffer: Joi.binary().required(),
                mimetype: Joi.string().valid(
                    'image/jpeg', 
                    'image/jpg', 
                    'image/png', 
                    'image/gif', 
                    'image/webp'
                ).required(),
                originalname: Joi.string().required(),
                size: Joi.number().max(5 * 1024 * 1024).optional()
            })
        )
    ).max(10)
);

const default_icon = "https://icons.veryicon.com/png/o/miscellaneous/category-icon-set/category-56.png";

export const defaultNullImageSchema = imageSchema.default(null);
export const defaultIconSchema = imageSchema.default(default_icon);
export const defaultArrayImageSchema = imageSchema.default([]);
export const requiredImageSchema = imageSchema.required();
export const optionalImageSchema = imageSchema.optional();

// Simple image schema for updates (only URI or null)
export const updateImageSchema = Joi.string().uri().allow(null).optional();