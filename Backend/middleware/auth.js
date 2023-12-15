const User = require('../model/usermodel');
const ErrorHandler = require('../utils/errorhandler');
const catchayncerror = require('./catchayncerror');
const jwt = require('jsonwebtoken')
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());

exports.isAuthenticatedUser = catchayncerror(async (req, res, next)=> {
  
  console.log(req.cookies); // Log cookies
  const { token } = req.cookies;

  console.log(token);

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);

    req.user = await User.findById(decodedData.id)
 
    next()
})

// exports.authorizeroles = (...roles) => {
//     return (req, res, next) => {
//         if(!roles.includes(req.user.role)){
//             return next (
//             new ErrorHandler(
//                 `Role: ${req.user.role}is not allow access this resource`,403
//             ))

//         }
//         next()
//     }
// }
exports.authorizeroles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorHandler(
            `Role: ${req.user.role} is not allowed to access this resouce `,
            403
          )
        );
      }
  
      next();
    };
  };