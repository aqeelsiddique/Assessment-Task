const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "admin"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    token: {
        type: String,
        default: ""
    }
});

// Hashing the password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});

// Compare Password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate Auth Token
// userSchema.methods.generateAuthToken = function () {
//     try {
//         const secretKey = process.env.SECRET_KEY ;
//         const expiresIn = process.env.JWT_EXPIRE ; // Default to 1 hour if not set
//         return jwt.sign({ id: this._id }, secretKey, {
//             expiresIn: expiresIn,
//         });
//     } catch (err) {
//         console.error('Error generating auth token:', err.message);
//         return null;
//     }
// };
// JWT TOKEN



userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Generate Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    return resetToken;
};

const User = mongoose.model("USER", userSchema);
module.exports = User;
