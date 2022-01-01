const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Project = require("../Models/projects");
const passport = require("passport");
const ProjectDetail = require("../Models/projectdetails");

//Add project
router.post("/AddProject", (req, res, next) => {
  let newProject = new Project({
    Title: req.body.Title,
    Category: req.body.Category,
    Description: req.body.Description,
    StartDate: req.body.StartDate,
    FinishDate: req.body.FinishDate,
  });
  //Check the user exists
  Project.findOne({ Title: req.body.Title }, (err, project) => {
    //Error during exuting the query
    if (project) {
      console.log(project);
      return res.send({
        success: false,
        message: "Error, project already exists",
      });
    } else {
      newProject.save((err, project) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: "Failed to save the project",
          });
        }
        res.send({
          success: true,
          message: "project Saved",
          project,
        });
      });
    }
  });
});

router.get("/project/:_id", (req, res, next) => {
  Project.find({ _id: req.params._id }, (err, project) => {
    if (err) {
      console.log(err);
      return res.json({ message: "Project not found" });
    } else {
      return res.json({ project: project });
    }
  }).populate("details");
});

router.post("/update/:_id", (req, res) => {
    let project = new Project({
        Title: req.body.Title,
        Category: req.body.Category,
        Description: req.body.Description,
        StartDate: req.body.StartDate,
        FinishDate: req.body.FinishDate,
      });
  Project.updateOne({_id:req.params._id},{
      $set:{
          "Title":project.Title,
          "Category":project.Category,
          "Description":project.Description,
          "StartDate":project.StartDate,
          "FinishDate":project.FinishDate
        }
        },
      (err, project) =>{
      if(project){
          return res.json({message:"project updated",project:project})
      }
      else{return res.json({message:err.message})}
  });
});

router.delete("/delete/:_id",(req, res) =>{
    Project.remove({_id:req.params._id},(err, project) =>{
        if(project){
            ProjectDetail.remove({project:req.params._id},(err, projectDetail) =>{
               
                if (err){return res.json({message:err.message});}
            })
            return res.json({message:"project removed"})
        }
        else{return res.json({message:err.message})}
    });

})
module.exports = router;
