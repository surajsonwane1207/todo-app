import { configDotenv } from "dotenv"
import exress from "express"
configDotenv()

const PORT = process.env.PORT || 3001
const app = exress()

app.get("/base",(req,res)=>{
    res.status(200).send("working fine")
})
app.listen(PORT,(req,res)=>{
    console.log("server is up and running on "+PORT)
})