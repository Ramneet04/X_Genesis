import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import { router } from './routes/vi';
const PORT = process.env.PORT || 8000;
const app=express();
app.use(express.json());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
app.use('/api/v1', router);
app.listen(PORT,()=>{
    console.log(`server is listening at port ${PORT}`)
})

app.get('/',(req,res)=>{
    res.send("hello");
})