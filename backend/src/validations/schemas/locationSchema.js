import Joi from 'joi';

const locationSchema = Joi.object({
    lat: Joi.number().min(-90).max(90).allow(null).required(),
    lng: Joi.number().min(-180).max(180).allow(null).required(),
}).allow(null);

export default locationSchema;