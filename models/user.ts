import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    downloadedImages: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Image'
    }],
    role: {
        type: String,
        enum: ["customer","admin"],
        default: "customer"
    }

}, {timestamps: true})


//hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        //if password is not modified, skip hashing
        //this is important for updating user profile
        return next();
    }
    try {
        
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();

    } catch (error) {
        console.log("Error hashing password: ", error);     
        next(error as mongoose.CallbackError);
        
    }
});

const User = mongoose.model("User", userSchema);

export default User;