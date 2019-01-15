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
  public_repos: {
    type: String,
    required: true
  },
  followers: {
    type: String,
    required: true
  },
  following: {
    type: String,
    required: true
  },
  avatar_url: {
    type: String,
    required: true
  }
});

const User = mongoose.model('users', UserSchema);
export default User;
