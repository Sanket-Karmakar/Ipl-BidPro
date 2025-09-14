import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
	fullname: {
		type: String,
		required: true,
		trim: true
	},
	username: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
	refreshToken: {
		type: String
	},
	virtualCash: {
		type: Number, 
		default: 10000,    				
		min: 0
	},
	profileImage: {
		type: String,
		default: ""
	},
	matchHistory: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Contest"
	}],
	teamHistory: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Team"
	}],
	favourites: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Player"
	}]
}, { timestamps: true });

userSchema.pre("save", async function(next) {
	if (!this.isModified("password")){
		return next();
	}
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods.isPasswordCorrect = function (plain) {
  	return bcrypt.compare(plain, this.password);
};

userSchema.methods.generateAccessToken = function() {
	return jwt.sign({
		_id: this._id,
		email: this.email,
		fullname: this.fullname,
		username: this.username
	},
	process.env.ACCESS_TOKEN_SECRET,
	{
		expiresIn: "7d"
	});
};

userSchema.methods.generateRefreshToken = function () {
  	return jwt.sign({ 
		_id: this._id 
	}, 
	process.env.REFRESH_TOKEN_SECRET, 
	{ 
		expiresIn: "30d" 
	});
};

userSchema.methods.toJSON = function() {
	const obj = this.toObject();
	delete obj.password;
	delete obj.refreshToken;
	return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
<<<<<<< HEAD

=======
>>>>>>> 9e219e03b845538a299dbfffb9978743f44048e8
