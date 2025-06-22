import mongoose from "mongoose";
import 'dotenv/config'

const MONGO_URI = process.env.MONGO_URI || '';
const Dbconnect = ()=>{
    mongoose.connect(MONGO_URI).
    then(()=>{
        console.log("db connection successfull")
    }).
    catch((err)=>{
        console.log("url--->",MONGO_URI);
		console.log(`DB Connection Failed`);
		console.log(err);
		process.exit(1);
    })
}
export default Dbconnect;