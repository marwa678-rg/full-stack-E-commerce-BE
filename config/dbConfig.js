//Imports
const mongoose = require("mongoose")
const dotenv = require("dotenv")

//Config
dotenv.config();

//Connection To Database
async function connectToDatabase(){
  try {
    await mongoose.connect(process.env.CONNECTION_STRING)
    console.log(`MONGO CLOUD CONNECTED SUCCESSFULLY`)
  } catch (error) {
    console.log(error)
  }
}

module.exports={connectToDatabase};