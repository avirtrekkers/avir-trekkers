require("dotenv").config();
const connectDB = require("./db/connect");
const register = require("./Models/register");

const registerData = [
    {
        "name":"Sneha",
        "username":"sneha@gmail.com",
        "password":"123"
    },
    {
        "name":"Anu",
        "username":"anu@gmail.com",
        "password":"1234"
    },
    {
        "name":"Sanket",
        "username":"sanket@gmail.com",
        "password":"123"
    },
    {
        "name":"Monali",
        "username":"monali@gmail.com",
        "password":"123"
    },
    {
        "name":"Sai",
        "username":"sai@gmail.com",
        "password":"123"
    }
]

const start = async ()=>{
    try{
        await connectDB(process.env.MONGODB_URL);
        await register.create(registerData);
        console.log("Success")
    }catch(error){
        console.log(error)
    }
};
start()