const mongoose = require("mongoose");

    //connecting to the database
    mongoose.connect(
        "mongodb+srv://enmhassan:fpVmF1VpgRzjB0yu@cluster0.ho0mqai.mongodb.net/?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        console.log("Successfully connected to database")
    })
    .catch((error) => {
        console.log("database connection failed");
        console.error(error);
        process.exit(1);
    });

module.exports = mongoose;