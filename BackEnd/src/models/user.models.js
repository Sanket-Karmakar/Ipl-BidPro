import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: true,
        trim: true, 
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    },
    profileImage: {
        type: String            //Cloudinary url
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: "Player"
    }],
    teamHistory: [{
        type: Schema.Types.ObjectId,
        ref: "FantasyTeam"
    }],
    matchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Match"
    }],
    fantasyCoins: {
        type: Number,
        default: 10000
    },
    refreshToken:{
        type: String
    }
}, {timestamps: true});

userSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign({
        _id: this._id,
        email: this.email,
        fullname: this.fullname,
        username: this.username
    },
    process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
};

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    }, process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
}

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);

