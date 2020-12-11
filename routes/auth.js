const router = require('express').Router();
const User = require('../model/User');


//VALIDATION
const Joi = require('joi');

router.post('/register', async (req, res, next) => {
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

    // validate request body against schema
    const { error, value } = await schema.validate(req.body, options);

    if (error) {
        // on fail return comma separated errors
       next( `Validation error: ${error.details.map(x => x.message).join(', ')}`);
        res.status(433);
    } else {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        try {
            const savedUser = await user.save();
            res.send(savedUser);
        } catch (err) {
            res.status(419).send(err);
        }
    }
});

module.exports = router;
