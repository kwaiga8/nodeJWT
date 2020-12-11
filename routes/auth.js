const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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
        //Hash the passwords
            const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        try {
            const savedUser = await user.save();
            res.send({user: user._id});
        } catch (err) {
            res.status(419).send(err);
        }
    }
});

//LOGIN
router.post('/login', async (req,res) =>{
    const { error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await User.findOne({email: req.body.email});
    if (!user){
        return res.status(423).send('Email not registered');
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass) return res.status(423).send('Invalid password');
    }
    //create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

    res.send('Logged in');
});

module.exports = router;
