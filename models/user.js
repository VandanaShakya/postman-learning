// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
  name: { 
    type: String,
     required: true, 
     trim: true 
    },
  email: {
     type: String, 
     required: true, 
     trim: true, 
     lowercase: true, 
     unique: true 
    },               
  role: { 
    type: String, 
    enum: ['user','admin','guest'], 
    default: 'user' 
},
  bio: { 
    type: String, 
    default: '' }
}, 
{ timestamps: true });

module.exports = mongoose.model('User', userSchema);
