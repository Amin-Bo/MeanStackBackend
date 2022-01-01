const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ProjectDetailsSchema = mongoose.Schema({
  project: { type: Schema.Types.ObjectId, ref: 'Project'},
  list:[
    {
    title:{type:String, require:true},
    status:{type:String, require:true}
  }
  ] 

});


const ProjectDetail = mongoose.model("ProjectDetail", ProjectDetailsSchema);

module.exports = ProjectDetail;
