import mongoose from "mongoose"
const VibeSchema =new mongoose.Schema({
    user:{
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            required:true
        },
        username: {
            type: String,
            required: true,
        },
    },
    vibeText: {
        type: String,
        required: true,
        trim: true,
     },
})
const Vibe=mongoose.model('Vibe',VibeSchema);
export default Vibe;

