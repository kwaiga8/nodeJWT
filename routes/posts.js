const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, async(req, res) =>{
   // res.send(req.user); find user based on this token

    res.json({posts: {title: 'my first post', description: 'oh my jwt, you will not see it without auth'}})
});
module.exports = router;