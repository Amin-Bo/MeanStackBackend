const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ProjectSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Category: { type: String, required: true },
  Description : { type: String },
  StartDate: { type: Date},
  FinishDate: { type: Date},
  details: { type: Schema.Types.ObjectId, ref: 'ProjectDetail' },
});


const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
