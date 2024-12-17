const mongoose = require("mongoose");
let usersSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: [String],
});
let UserModel = mongoose.model("user", usersSchema);

module.exports = UserModel;