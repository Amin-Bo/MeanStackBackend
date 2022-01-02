const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

// Schema Definition
//TODO: Assignment: Add Validate rule for email to be unique

const UserSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, required: true, default:'user'},
  phone: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  project :[ { type: Schema.Types.ObjectId, ref: 'Project' }],
});

//Pre Save Hook. Used to hash the password
UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  //Generate Salt Value
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    //Use this salt value to hash password
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      this.password = hash;
      next();
    });
  });
});

//Custom method to check the password correct when login
UserSchema.methods.isPasswordMatch = function (
  plainPassword,
  hashed,
  callback
) {
  bcrypt.compare(plainPassword, hashed, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
