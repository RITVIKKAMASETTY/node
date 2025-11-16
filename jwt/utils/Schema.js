import Joi from 'joi';
const listingschema=Joi.object({
    title:Joi.string().min(3).max(50).required(),
    price:Joi.number().min(1).max(10000).required(),
    description:Joi.string().max(500).allow('').optional(),
    categoryId:Joi.number().required(),
    images:Joi.array().items(
        Joi.object({
            uri:Joi.string().required()
        })
    ).min(1).required(),
});
export default listingschema;

const reviewschema=Joi.object({
    rating:Joi.number().min(1).max(5).required(),
    comment:Joi.string().max(1000).allow('').optional(),
});
export {reviewschema};
const userschema=Joi.object({
    email:Joi.string().email().required(),
    username:Joi.string().alphanum().min(3).max(30).required(),
    password:Joi.string().min(6).max(100).required(),
});
export {userschema};