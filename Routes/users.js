const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../Models/users.js')
const passport = require('passport');
const bcrypt = require('bcryptjs');
const ONE_WEEK = 604800; //Token validtity in seconds

//Login
router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const query = { email }
        //Check the user exists
    User.findOne(query, (err, user) => {
        //Error during exuting the query
        if (err) {
            return res.send({
                success: false,
                message: 'Error, please try again'
            });
        }

        //No User match the search condition
        if (!user) {
            return res.send({
                success: false,
                message: 'Error, Account not found'
            });
        }

        //Check if the password is correct
        user.isPasswordMatch(password, user.password, (err, isMatch) => {

            //Invalid password
            if (!isMatch) {
                return res.send({
                    success: false,
                    message: 'Error, Invalid Password'
                });
            }

            //User is Valid

            const ONE_WEEK = 604800; //Token validtity in seconds

            //Generating the token
            const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: ONE_WEEK });
            console.log(token)
                //console.log( jwt.decode(token))
                //User Is Valid
                //This object is just used to remove the password from the returned fields
            let returnUser = {
                name: user.name,
                email: user.email,
                id: user._id,
            }

            //Send the response back
            return res.send({
                success: true,
                message: 'You are logged in now',
                user: returnUser,
                token
            });
        });

    });

});

//Registration
router.post('/register', (req, res, next) => {
    let newUser = new User({
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password
    });
    const query = req.body.email;
    //Check the user exists
    User.findOne({ email: req.body.email }, (err, user) => {
        //Error during exuting the query
        if (user) {
            return res.send({
                success: false,
                message: 'Error, User already exists'
            });
        } else {
            newUser.save((err, user) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Failed to save the user'
                    });
                }
                res.send({
                    success: true,
                    message: 'User Saved',
                    user
                });
            });
        }
    });

});

router.get('/profile', (req, res, next) => {
    let token = req.headers.authorization;
  
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        User.find({_id: decoded.user._id},(err, user)=>{
            if (err) return res.json({messsage:"error"});
            else{return res.json(user)}
        }).populate("project");
    })
  
});

/*router.get('/getProjects', (req, res, next) => {
    let token = req.headers.authorization;
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
       // console.log(decoded);
        User.find({_id: decoded.user._id }).populate('project').then((decoded) => {
            if (decoded) {
                return res.json({user:decoded.user})
            }
        }); 
    });
    res.json({ success: true, message: 'profile ', user: req.user })

})*/

router.post("/update", (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    newUser = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
        });
    });
    let token =req.headers.authorization ||req.body.token; //token

    //token = token.substring(4, token.length)
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        User.findOne({ _id: decoded.user._id }, (err, user) => {
            User.findOneAndUpdate({ email: user.email }, newUser, {
                useFindAndModify: false,
            }).then((user) => {
                if (!user) {
                    return res.status(404).json({
                        msg: "user not found !",
                        success: false,
                    });
                }
                user = newUser;
                const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: ONE_WEEK });
                res.status(200).json({
                    success: true,
                    user: user,
                    token,
                    msg: "User updated successfully!",
                });
            });
        });
    });
});

module.exports = router;