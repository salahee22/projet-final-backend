const mongoose= require("mongoose")

require("dotenv").config()

const handleConnectDB=async()=>{
    try{
        await mongoose.connect(process.env.MongoDB_URL)
        console.log("mongodb connected successfully");
        
    }
    catch(error){
        console.error(error.message)
    }
}

module.exports={handleConnectDB}