const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        },
    otp: {
        type: String,
        required: true
    },
    otp_present: {
        type: Boolean,
        required: false
    }
},
{
    timestamps: true
})

const Otp = mongoose.model('Otp',otpSchema);

module.exports = Otp;