const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Otp = require('./otpmodel');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique:true,
            trim: true,
            lowercase:true,
            validator(value) {
                if(!validator.isEmail(value)) {
                    throw new Error('Email is invalid');
                }
            }
        },
        username: {
            type: String,
            required: true,
            trim: true
          },
        number: {
            type: Number,
            required: true,
            trim: true,
            validator(value) {
                if(!validator.isInt(value)) {
                    throw new Error('Phone number is invalid');
                } else {
                    if(!validator.isLength(value)) {
                        throw new Error('Phone number is invalid');
                    }
                }
            }
        },
        userid: {
            type: String,
            unique: true,
            required: true,
            trim:true
          },
          password:{
              type: String,
              unique: true,
              required: true,
              trim: true
          },
        balance: {
            type: Number,
            required: true,
            trim: true,
            validator(value) {
                if(value<0) {
                    throw new Error('Amount is invalid');
                }
            }
        },
    },
    {
        timestamps: true
    }
)

// userSchema.virtual('myotp', {
//     ref: 'Otp',
//     localField: '_id',
//     foreignField: 'userid'
// });

 userSchema.statics.checkCredentials = async (userid, password, user) => {
     try {
     const isMatch = await (bcrypt.compare(password,user.password) && bcrypt.compare(userid,user.userid));
    return isMatch; 
    } catch(error) {
        return error;
    }
 }

userSchema.pre('save', async function(next) {
    const user = this;
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    if(user.isModified('userid')) {
        user.userid = await bcrypt.hash(user.userid,8);
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;