const catchayncerror = require("../middleware/catchayncerror");
const User = require("../model/usermodel");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/errorhandler");
const sendEmail = require("../utils/senEmail");
const bcrypt = require('bcrypt');
const cloudinary = require("cloudinary");
const crypto = require("crypto");

const nodemailer = require("nodemailer");
const { merge } = require("../app");
// const randomString = require ('random-string');
/////////////send email
/// Register A User
exports.registerUser = catchayncerror(async (req, res, next) => {
  const { name, email, password, cpassword } = req.body;

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If email exists, return an error response
      return res.status(400).json({
        success: false,
        error: 'Email already in use. Please choose a different email.',
      });
    }

    // If email doesn't exist, create a new user
    const user = await User.create({
      name,
      email,
      password,
      cpassword,
    });

    // Generate a token and send a success response
    const token = user.generateAuthToken();
    res.status(200).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    // Handle other errors
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/////////////////////////////////////////////User A login


exports.loginUser = catchayncerror(async (req, res, next) =>{
  //this code line means agr humy specfie data chaiyae tu yeh estmal kr sgthy
try {
  const {email, password} = req.body;
  ////////////check if user has given the both right password and name
  if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email & Password", 400))
  }
  const userlogin = await User.findOne({ email }).select("+password");

  if (userlogin){
      const isMatch = await userlogin.comparePassword(password);

      token = await userlogin.generateAuthToken();
      console.log(token);
      res.cookie("jwttoken", token , {
        expires:new Date(Date.now() + 25892000000),
        httpOnly:true
      })
      ///create a cokki4res.cokkie
      if(!isMatch) {
          return next(new ErrorHandler("User Error", 400));          
      } 

      else {
        sendToken(userlogin, 200, res)
                  res.cookie('jwttoken', token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true
        })       
          res.send({meassage:" wellcome user login sucessfully"})            
      }
  }
   else {
      res.status(422).send({message: "invalid"})       
     }   
}

catch(err)
{
 console.log(err);
}
})



/////////////////

//logout functionnn
exports.logout = catchayncerror(async (req, res, next) => {
  res.cookie("token", null, {
    experies: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "logout",
  });
});

////////////////////////forgot Password////////////////////

// exports.forgetpassword = catchayncerror(async (req, res , next) => {
//   const user = await User.findOne({email: req.body.email});
//   console.log(user)
//   if(!user){
//     return next( new ErrorHandler("user not found", 404))
//   }
//   const randomString = user.getResetPasswordToken();
//   const data = await User.updateOne({email:req.body.email})
//   sendEmail(user.name, user.email, user.randomString)
//   res.status(200).json({
//     success:true,
//     message: `Email sent to ${user.email} successfully`
//   })

//   const resetToken = user.getResetPasswordToken();
//   console.log("resettokennnn",resetToken)
//   await user.save({validateBeforeSave: false});
//   const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
//   console.log("eeee",resetUrl)
//   const message = `Your password reset token is :- \n\n ${resetUrl}\n\nIf you have not requested this email then, please ignore it.`;
//   // const message = `Your password reset token is as follows:\n\n${resetUrl}\n\n If you have not requested this email, then please ignore.`
//   try {

//     await sendEmail({
//       email:user.email,
//       subject: `Ecommerce reset password recovery`,
//       message,
//     });
//     res.status(200).json({
//       success:true,
//       message: `Email sent to ${user.email} successfully`
//     })

//   } catch (error) {

//     user.resetPasswordToken= undefined
//     user.resetPasswordExpire= undefined
//     await user.save({validateBeforeSave: false});
//     return next(new ErrorHandler(error.message, 500))

//   }

// })

// Forgot Password
exports.forgetpassword = catchayncerror(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: ` Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//////////Reset password
////creating token hash///////////////

exports.resetpassword = catchayncerror(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  console.log("reset testing", user);

  if (!user) {
    return next(
      new ErrorHandler("Reset Password is invalid or has been Expeired", 400)
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

////////////////////abi rset and forget code ryhta yae

////////////////////////Get User Details

exports.getUserDeatils = catchayncerror(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});
////////////delte a user by admin
exports.deleteUser = catchayncerror(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User delete successfull",
  });
});

///////update password
exports.updatepassword = catchayncerror(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const ispasswordmatched = await user.comparepassword(req.body.oldpassword);

  if (!ispasswordmatched) {
    return next(new ErrorHandler("old password is incorrect", 400));
  }
  if (req.body.newpassword !== req.confirmPassword) {
    return next(new ErrorHandler("old password is incorrect", 400));
  }
  user.password = req.body.newpassword;
  await user.save();

  sendToken(user, 200, res);
});
////////////update user profile
exports.updateprofile = catchayncerror(async (req, res, next) => {
  const newuserdata = {
    name: req.body.name,
    email: req.body.email,
  };
  /////////we will cloud user profile update data
  const user = await User.findByIdAndUpdate(req.user.id, newuserdata, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
  });
});

///////////get all users(admin) to see the all user

exports.getallusers = catchayncerror(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

///////////get all user details(admin) to see the all details

exports.getsingleuser = catchayncerror(async (req, res, next) => {
  const user = await User.find(req.params.id);

  if (!user) {
    return new ErrorHandler(`user does not exists with id:${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    user,
  });
});

////////////update user role --admin
exports.updateprofilerole = catchayncerror(async (req, res, next) => {
  const newuserdata = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.user.id, newuserdata, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

////////////delete user --admin
exports.deleteuser = catchayncerror(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  /////////we will cloud user profile update data
  if (!user) {
    return next(
      new ErrorHandler(`user does not exist with id : ${req.params.id}`)
    );
  }
  await user.remove();

  res.status(200).json({
    success: true,
    message: "User deleted Successfully",
  });
});

//   const token = jwt.sign({ id: this._id}, process.env.RESERSECRET_KEY, {
//     expiresIn:'20ms',
// });
// const data = {
//   from: "webdeveloperaqeel@gmail.com",
//   to:email,
//   subject:"options.subject",
//   text:"options.message",
//   html: 'hi '+name+', please reset the password <a href="http://localhost:4008/api/v1/password/reset?token='+token+'"> </a>'

// };

// return user.updateOne({resetlink:token}), function(err, success) {
//   if(err){
//     return res.status(400).json({error:"reset password link error"})
//   } else {
//     mg.messages().send(data, function(error, body){
//       if(err){
//         return res.json({
//           error:err.message

//         })
//       }
//       return res.json({message: "Email has been sent"})
//     })

//   }

// }
