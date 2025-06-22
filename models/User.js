import mongoose from "mongoose"
const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please provide the required field"]
    },
    email:{
        type:String,
        required:[true,"Please provide the email"]
    },
    password:{
        type:String,
        required:[true,"Please provide the password"]
    }
})
const User=mongoose.model('User',UserSchema);
export default User;