const mongoose = require("mongoose");
let usersSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: [String],
  default: ['user']
});
let UserModel = mongoose.model("user", usersSchema);

module.exports = UserModel;