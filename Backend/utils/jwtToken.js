// create token and cokies save

const sendToken = (user, statusCode,res) =>{
    const token = user.generateAuthToken();

    //option for cokies
    const options = {
        expires: new Date(
            Date.now() + process.env.COKIE_EXPIRE*24*60*60*1000
        ),

        httpOnly: true,
    };
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token

    })

}

module.exports = sendToken