import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  html_url: {
    type: String,
    required: true
  },
  avatar_url: {
    type: String,
    required: true
  },
  followers: {
    type: Number,
    required: true
  },
  following: {
    type: Number,
    required: true
  },
  public_repos: {
    type: Number,
    required: true
  }
});

const User = mongoose.model('users', UserSchema);
export default User;
