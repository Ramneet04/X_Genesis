import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import userRoutes from './routes/v1/user';
import Dbconnect from './config/database'
const PORT = process.env.PORT || 8000;
Dbconnect();

const app=express();
app.use(express.json());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
app.use('/api/v1/auth', userRoutes);
app.listen(PORT,()=>{
    console.log(`server is listening at port ${PORT}`)
})

app.get('/',(req,res)=>{
    res.send("hello");
})