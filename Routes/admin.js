const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../Models/users.js')
const Project = require('../Models/projects.js');
const Details  = require('../Models/projectdetails');

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

router.delete('/user/:_id', (req, res, next) => {
    User.findOneAndRemove({ _id:req.params._id}, (err, user)=>{
        if (err){
            console.log("error to delete user")
            return res.json({message: 'error'})
        }
        else{
            Project.remove({ _id:user.project},(err, project)=>{
                if (project){
                    Details.remove({_id:project.details},(err, details)=>{
                        if (details){
                            return res.json({message:"user deleted successfully"})
                        }
                        else{
                            return res.json({message:" error occurred while deleting"})
                        }
                    })
                }
            })
        }
    })
})
module.exports = router;