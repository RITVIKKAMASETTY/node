import mongoose from "mongoose";
import passportlocalmongoose from "passport-local-mongoose";
const usersSChema = new mongoose.Schema({
    email:{type:String,required:true,unique:true}
});
usersSChema.plugin(passportlocalmongoose);
const User = mongoose.model("User",usersSChema);
export default User;