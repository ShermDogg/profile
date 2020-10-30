const mongoose = require('mongoose');
const config = require('config');


const db = config.get('mongoURI');

const connectDB = async () => {
    try{
        mongoose.connect(db, {
            useNewUrlParser:true,
            useCreateIndex:true,
            useUnifiedTopology:true,
            useFindAndModify: false
        });

        console.log('MongoDB Connected...')

    }catch(err) {
        console.error(err.message);

    }
}

module.exports = connectDB;