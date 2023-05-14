const mongoose = require("mongoose");

const { MONGO_URI } = process.env;
console.log(MONGO_URI);
exports.connect = () => {
    //connecting to the database
    mongoose.connect(
        MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        console.log("Successfully connected to database")
        app.listen(port, ()=>{
            console.log(`Server is listening on port ${port}`)
        })
    })
    .catch((error) => {
        console.log("database connection failed");
        console.error(error);
        process.exit(1);
    });
};