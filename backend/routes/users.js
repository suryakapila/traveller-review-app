const router = require('express').Router();
const User = require('../models/user');
const encrypt = require('bcrypt');

//register
router.post('/register', async (req, res) => {
    try {
        //generate new password
        const salt = await encrypt.genSalt(10);
        const hashedPassword = await encrypt.hash(req.body.password, salt);
        //create new user
        const newUser = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: hashedPassword,
        });
        const user = await newUser.save();
        console.log('\x1b[42m%s\x1b[0m','[Success] User registration successful');
        res.status(200).json({userID: user._id});
    } catch (error) {
                console.log('\x1b[41m%s\x1b[0m','[Failed] to register the user');
        res.status(500).json(error.message);
    }
});

//login
router.post('/login', async (req, res) => {
    try {

        //find a specific User
        const user = await User.findOne({userName: req.body.userName});
        if(!user) {
            console.log('\x1b[41m%s\x1b[0m','[Failed] invalid user name');
            res.status(400).json('Invalid user name or password');
        }
        else{
            //validate password
            const validPassword = await encrypt.compare(req.body.password, user.password);
            if(!validPassword) {
                console.log('\x1b[41m%s\x1b[0m','[Failed] invalid password');
                res.status(400).json('Invalid user name or password');
            }
            else{
                console.log('\x1b[42m%s\x1b[0m','[Success] login successful');
                res.status(200).json({_id: user._id, userName: user.userName});
        }
    }
    } catch (error) {
        console.log('\x1b[41m%s\x1b[0m','[Failed] to login user');
        res.status(500).json(error.message);
    }
});

module.exports = router;