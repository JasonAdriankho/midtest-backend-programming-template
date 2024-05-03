const usersSchema = {
  name: String,
  email: String,
  password: String,
  logAtt: Number,
  unlockedAt: Number,
  userLocked: Boolean,
};

module.exports = usersSchema;
