const ErrorHandler = require('../utils/errorhandler');
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message    =  err.message || "enternal server error";
    ///wrong mongodb  id error 

    if (err.name === "CastError") {
        const message = `Resource not found .invalid: ${err.path}`;
        err= new ErrorHandler(message,400)
    }
    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    })
}