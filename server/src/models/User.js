// import mongoose, { Schema } from 'mongoose';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  githubId: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  githubApiUrl: {
    type: String,
    required: true
  },
  githubUrl: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    required: true
  },
  numFollowers: {
    type: Number,
    required: true
  },
  numRepos: {
    type: Number,
    required: true
  },
  usersFollowing: [{ type: Schema.Types.ObjectId, ref: 'users' }]
});

const User = mongoose.model('users', UserSchema);
// export default User;
module.exports = User;
