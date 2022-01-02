const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Details = require("../Models/projectdetails");
const Project = require("../Models/projects");
const User = require("../Models/users");

//Add project
router.post("/add/:_id", (req, res, next) => {
  let list = [];
  let newDetails = new Details({
    project: req.params._id,
    list: req.body.list,
  });
  list = req.body.list;
  //console.log(req.body.list.title);

  Details.find({ project: req.params._id }, (err, project) => {
    //Error during exuting the query
    if (project.length == 0) {
      newDetails.save((err, details) => {
        if (err) {
          console.log(err);
          return res.json({ message: "something wrong !!" });
        } else {
          Project.findOneAndUpdate(
            { _id: req.params._id },
            { $set: { details: details._id } },
            (err, p) => {
              if (err) {
                console.log(err);
                return res.json({ message: "errr" });
              }
            }
          );
          return res.json({ details: details });
        }
      });
    } else if (project.length > 0) {
      Details.updateOne(
        { project: req.params._id },
        {
          $push: { list: list },
        },
        (err, d) => {
          if (err) {
            console.log(err);
            return res.json({ message: "something wrong !!" });
          } else {
            Project.findOneAndUpdate(
              { _id: req.params._id },
              { $set: { details: d._id } },
              (err, p) => {
                if (err) {
                  console.log(err);
                  return res.json({ message: "errr" });
                } else {
                  console.log(p);
                }
              }
            );
            return res.json({ details: d });
          }
        }
      );
    } else {
      // console.log(err)
    }
  });
});

router.get("/detail/:_id", (req, res, next) => {
  let id = req.params._id;
  Details.findOne({ "list._id": id }, (err, project) => {
    if (err) {
      console.log(err);
      return res.json({ message: "Project not found" });
    } else {
      if (project==null) {
        return res.json({ message: "task not found" });
      }
     
      let list = project.list;
      let target;
      for (let i = 0; i < list.length; i++) {
        if (list[i]._id == req.params._id) {
          target = list[i];
        }
      }
      console.log(target);
      return res.json({ list: target });
    }
  }).populate("project");
});
router.get("/details/:_id", (req, res, next) => {
  let token = req.headers.authorization||req.body.token;
  let id = req.params._id;
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    let user=decoded.user;
    console.log(user)
    User.findOne({_id: user._id}, (err, user) => {
      if (err) throw err;
      else{
        Project.findOne({ _id: req.params._id }, (err, project) => {
          if (err) {
            console.log(err);
            return res.json({ message: "Project not found" });
          } else {
            let list=project.details.list;
            let done=[];
            let doing=[];
            let toDo=[];
            for (let i=0; i<list.length; i++) {
              if(list[i].status =="doing") {
                  doing.push(list[i].title)
              }
              if(list[i].status =="done") {
                done.push(list[i].title)

              }
              if(list[i].status =="toDo") {
                toDo.push(list[i].title)
              }
            }
            console.log(list);
            return res.json({ project: project ,todo: toDo ,done: done ,doing: doing });
          }
        }).populate("details");
      }
});
});
});

router.post("/update/:_id", (req, res) => {
  let details = new Details();
  details = req.body.list;
  let id = req.params._id;
  Details.findOne({ "list._id": id }, (err, project) => {
    if (err) {
      console.log(err);
      return res.json({ message: "Project not found" });
    } else {
        let list = project.list;
      for (let i = 0; i < list.length; i++) {
        if (list[i]._id == req.params._id) {
             list[i].title=req.body.list.title;
             list[i].status=req.body.list.status;
           // console.log(list[i])
        }
    }
    Details.updateOne({"list._id":req.params._id},{$set:{list:list}},(err, details)=>{
        if(err) {
            console.log(err);
            return res.json({ message: "err"})
        }
        
    })
    console.log(list)
     return res.json({ list: list });
    }
  })
});
router.delete('/delete/:_id',(req, res) => {
    Details.findOne({ "list._id": req.params._id }, (err, project) => {
        if (err) {
          console.log(err);
          return res.json({ message: "Project not found" });
        } else {
            let list = project.list;
          for (let i = 0; i < list.length; i++) {
            if (list[i]._id == req.params._id) {
                 list.splice(i, 1);
               // console.log(list[i])
            }
        }
        Details.updateOne({"list._id":req.params._id},{$set:{list:list}},(err, details)=>{
            if(err) {
                console.log(err);
                return res.json({ message: "err"})
            }
            
        })
        console.log(list)
         return res.json({ list: list });
        }
      })
})

module.exports = router;
