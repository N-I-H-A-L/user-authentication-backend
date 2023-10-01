import express from "express";
import { connectDB, User } from "./database.js";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = express();

const port = 4000;

connectDB();

const corsoptions = {
    //to allow requests from client
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1",
    ],
    credentials: true,
};

//Middlewares
app.use(cors(corsoptions));
app.use(cookieParser());
app.use(express.json());

const server = http.createServer(app);

app.get('/', async (req, res)=>{
    //Get the token cookie from the cookies object.
    const { token } = req.cookies;
    //if token is not undefined
    if(token){
        const decoded = jwt.verify(token, "provide_a_secret_key");
        //verify method will decode the JWT token and give the actual value which was encoded.
        
        //Get the user from the database 
        const user = await User.findById(decoded._id);

        //Send response that 'login' is true with the details of the user.
        res.json({
            success: true,
            login: true,
            user
        });
    }
    else{
        //Else send response 'login' is false.
        res.json({
            success: true,
            login: false
        });
    }
});

app.post('/login', async (req, res)=>{
    //On making a post request to '/login' URL, add the cookie 'token' in the frontend. 
    const { name, password } = req.body;

    //Find the user with the 'name' received from req.body.
    const user = await User.findOne({name});

    //If user doesn't exists it means, user should register instead of logging in.
    if(!user){
        res.json({
            notRegistered: true,
            success: true
        });
    }
    //If user name is correct but password is not, inform it to the frontend.
    //bcrypt.compare will compare the password received from req.body with the hashed password received from
    // database, and returns true if the hashed password is the hash of password of req.body. Else false.
    else{
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.json({
                success: true,
                password: false
            });
        }

        //Else add the user details as cookie then frontend will let the user login by checking the cookies.
        else{
            const token = jwt.sign({_id: user._id}, "provide_a_secret_key");
            res.cookie("token", token);
            res.json({
                success: true
            });
        }
    }
});

app.post('/register', async (req, res)=>{
    //Register new user, get name and password
    const { name, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    //Create the user in database.
    await User.create({
        name,
        password: hashedPassword
    });

    res.json({
        sucess: true
    });
});

app.get('/logout', async (req, res)=>{
    res.cookie("token", null, {
    //To delete the cookie, set the expiry time of cookie to 0. So that the cookie will get expired.
        expires: new Date(0)
    });
    res.json({
        success: true,
    });
});

server.listen(port, ()=>{
    console.log("Server started");
});