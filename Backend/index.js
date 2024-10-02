import dotenv from "dotenv";
dotenv.config({path: "./.env"});
import connectDB from "./src/db/index.js";
import { app } from './app.js';




// Connect to MongoDB

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.error("Server failed to start")
    
})