const router = require('express').Router();
const User = require('../model/User');
const {registerValidation} = require('../validation');


//VALIDATION
const Joi = require('joi');

router.post('/register', async (req, res, next) => {

   const {error} = registerValidation(req.body);

    if (error) {
        // on fail return comma separated errors
       next( `Validation error: ${error.details.map(x => x.message).join(', ')}`);
        res.status(433);
    } else {
        //Check if user is already in database
        const emailExist = await User.findOne({email: req.body.email});
        if (emailExist){
            return res.status(433).send('Email already exists');
        }
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
