const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../Models/users.js')
const passport = require('passport');
const bcrypt = require('bcryptjs');
const ONE_WEEK = 604800; //Token validtity in seconds


   router.get('/users', (req, res, next) => {
       User.find({}, (err, user) => {
           if (err){
               return res.json({ message: err.message})
           }
           else{
               return res.json({ user})
           }
       }).populate("project");
});


module.exports = router;