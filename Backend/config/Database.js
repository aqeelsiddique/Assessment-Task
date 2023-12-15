const mongoose = require("mongoose");



const connectDatabase = () => {
    // Set 'strictQuery' to false to prepare for the change in Mongoose 7
    mongoose.set('strictQuery', false);

    mongoose.connect("mongodb://localhost:27017/Task_Assengment", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });
};
module.exports = connectDatabase
