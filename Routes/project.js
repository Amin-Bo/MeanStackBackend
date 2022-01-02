const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Project = require("../Models/projects");
const passport = require("passport");
const ProjectDetail = require("../Models/projectdetails");
const User = require("../Models/users");

//Add project
router.post("/AddProject", (req, res, next) => {
  let newProject = new Project({
    Title: req.body.Title,
    Category: req.body.Category,
    Description: req.body.Description,
    StartDate: req.body.StartDate,
    FinishDate: req.body.FinishDate,
  });
  let token = req.headers.authorization || req.body.token;
  //console.log(token)
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    let user = decoded.user;
    User.find({ _id: decoded.user._id }).then((decoded) => {
      if (!decoded) {
        console.log("err");
      } else {
        Project.findOne({ Title: req.body.Title }, (err, project) => {
          //Error during exuting the query
          if (project) {
            //console.log(project);
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
              } else {
                // console.log(user)
                //console.log(project._id);
                User.findOneAndUpdate(
                  { _id: user._id },
                  { $addToSet: { project: project._id } },
                  (err, user) => {
                    if (err) throw err;
                  }
                );
                // user.save()
                res.send({
                  success: true,
                  message: "project Saved",
                  user,
                });
              }
            });
          }
        });
        // console.log(project);
        // res.send({project})
      }
    });
  });
  //Check the user exists
  // Project.findOne({ Title: req.body.Title }, (err, project) => {
  //   //Error during exuting the query
  //   if (project) {
  //     console.log(project);
  //     return res.send({
  //       success: false,
  //       message: "Error, project already exists",
  //     });
  //   } else {
  //     newProject.save((err, project) => {
  //       if (err) {
  //         console.log(err);
  //         return res.send({
  //           success: false,
  //           message: "Failed to save the project",
  //         });
  //       }
  //       res.send({
  //         success: true,
  //         message: "project Saved",
  //         project,
  //       });
  //     });
  //   }
  // });
});

router.get("/project/:_id", (req, res, next) => {
   let done =[];
  let doing = [];
  let toDo=[];
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
  Project.updateOne(
    { _id: req.params._id },
    {
      $set: {
        Title: project.Title,
        Category: project.Category,
        Description: project.Description,
        StartDate: project.StartDate,
        FinishDate: project.FinishDate,
      },
    },
    (err, project) => {
      if (project) {
        return res.json({ message: "project updated", project: project });
      } else {
        return res.json({ message: err.message });
      }
    }
  );
});

router.delete("/delete/:_id", (req, res) => {
  Project.remove({ _id: req.params._id }, (err, project) => {
    if (project) {
      ProjectDetail.remove(
        { project: req.params._id },
        (err, projectDetail) => {
          if (err) {
            return res.json({ message: err.message });
          }
        }
      );
      return res.json({ message: "project removed" });
    } else {
      return res.json({ message: err.message });
    }
  });
});
router.get("/projects/", (req, res, next) => {
  newProject = {};
  let done =[];
  let doing = [];
  let toDo=[];
  let token = req.headers.authorization || req.body.token;
  //console.log(token)
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    let user = decoded.user;
    //console.log(decoded)
    User.findOne({ _id: user._id }, (err, user) => {
      if (err) throw err;
      else {
        User.find({ _id: user._id }, (err, user) => {
          if (err) {
            console.log(err);
            return res.json({ message: "Project not found" });
          } else {
            Project.find({ _id: decoded.user.project }, (err, p) => {  
              
              return res.json({ message: "all projects", project: p });
            }).populate("details");
          }
        });
      }
    });
  });
});
router.get("/allProjects/", (req, res, next) => {
  newProject = {};
  let done =[];
  let doing = [];
  let toDo=[];
  let token = req.headers.authorization || req.body.token;
  //console.log(token)
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    let user = decoded.user;
    //console.log(decoded)
    User.findOne({ _id: user._id }, (err, user) => {
      if (err) throw err;
      else {
        User.find({ _id: user._id }, (err, user) => {
          if (err) {
            console.log(err);
            return res.json({ message: "Project not found" });
          } else {
            Project.find({ _id: decoded.user.project }, (err, p) => {  

              return res.json({ message: "all projects", project: p });
            })
          }
        });
      }
    });
  });
});
/*router.get('/allProjects', (req, res, next)=>{
  Project.find({},(err, p) => {
    if (err) {
      return res.json({ message:'error'})
    }
    else {
      return res.json({ project: p })
    }
  })
})*/
module.exports = router;
