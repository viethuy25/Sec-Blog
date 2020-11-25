const Joi = require('joi');

module.exports.BlogPostSchemaJoi = Joi.object({
    post: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        author: Joi.string().required(),
        image: Joi.string().required(),
    }).required()
})