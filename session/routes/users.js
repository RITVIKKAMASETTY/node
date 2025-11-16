import { Router } from "express";
import User from "../models/users.js";
import { userschema } from "../utils/Schema.js";
import warapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import passport from "passport";
import { register } from "module";
const usersrouter=Router();
function checkPassword(user,password){
    return User.authenticate(password);
}
usersrouter.post("/register",warapAsync(async (req,res)=>{
    const {error} = userschema.validate(req.body);
    if(error){
      const msg = error.details.map(el=>el.message).join(',');
      throw new ExpressError(msg,400);
    }
    const {email,username,password}=req.body;
    const user = new User({email,username});
    const registeredUser = await User.register(user,password);
    registeredUser.currenturl= req.originalUrl;
    res.status(201).send(registeredUser.toJSON());
}));
usersrouter.post("/login",passport.authenticate('local'),warapAsync(async (req,res)=>{
   res.send({message:"Login successful"});
}));
usersrouter.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        res.send({message:"Logout successful"});
    });
});
export default usersrouter;