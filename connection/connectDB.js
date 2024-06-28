const mongoose = require('mongoose');

// connect to the database
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DATABASE_URL,{ 
                useNewUrlParser: true,
                useUnifiedTopology: true,
            
        });
        console.log(
            `DB connection successful! at ${new Date().toLocaleString()}`
        );
    } catch (err) {
        console.log("some things went")
        console.log(err);
    }
};

module.exports = connectDB;