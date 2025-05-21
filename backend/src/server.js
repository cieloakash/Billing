import app from "./app.js";
import { connectDb } from "./lib/db.js";

app.listen(process.env.PORT,()=>{
    console.log("server running",process.env.PORT);
    connectDb()
})
