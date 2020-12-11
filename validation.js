const Joi = require('joi');

//Register Validation
const registerValidation  =  (data) => {

    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
// schema options
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    return schema.validate(data, options);
};

const loginValidation  =  (data) => {

    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
// schema options
    const options = {
        abortEarly: false, // include all errors
    };
    return schema.validate(data, options);
};


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;