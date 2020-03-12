const User = require('../database/usermodel');
const Otp = require('../database/otpmodel');
const express = require('express');
const router = new express.Router();
const accountcheck = require('../middleware/mlogin');
var aesjs = require('aes-js');
const bcrypt = require('bcryptjs');
const client = require('twilio')(process.env.accountSid,process.env.authToken);

router.post('/bankdetail', async (req, res) => {
    const user = new User(req.body);
    console.log(user);
    try {
      await user.save();
      return res.status(201).send({ user });
    } catch (e) {
      console.log(e);
      return res.status(400).send({ error: e });
    }
  });
  
router.post('/bankauthentication', async (req,res) => {
  try {
      const hasheduserid = await bcrypt.hash(req.body.userid,8);
      console.log(hasheduserid,req.body.userid,req.body.password);
      const users = await User.find();
      //console.log(users);
      var user = null;
      for(let i=0;i<users.length;i++) {
        const {userid,password} = users[i];
     //   console.log(id,userid);
        let ans =  await (bcrypt.compare(req.body.userid,userid) && bcrypt.compare(req.body.password,password));
       // console.log(ans,users[i]);
        if(ans) {  
        user = users[i];
          break;
        }
      }

      console.log(user);
      if(!user) {
        throw "Check your credentials";
      } else {
        const hashedpassword = await bcrypt.hash(req.body.password,8);
        if(!hashedpassword) { 
          throw "Check your credentials";
        } else {
        res.status(200).send({'message':'Authenticated'});  
    }
    }
  } catch(error) {
    console.log(error);
    res.status(400).send({error});
  }
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

async function compareOtp(recievedotp,uid, amount, balance) {

  try {
    console.log(recievedotp,uid,amount,balance);
    const otp = await Otp.findOne({userid: uid});
    console.log(otp, typeof(otp.updatedAt));
    var created = new Date(otp.updatedAt);
    var key_256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    var todays_date = new Date();
    var timediff = todays_date.getTime() - created;
    console.log('timediff =>',timediff,created, todays_date);
    // Otp.updateOne({ userid: uid },{
    //   otp:'',otp_present:false 
    // }, (error, response) => {
    //   if (response) {
    //     console.log('response =>', response);
    //   }
    //   if (error) {
    //     console.log('error =>', error);
    //   }
    // });
    if(timediff< 5 * 60 * 1000 && otp.otp_present) {
      var encryptedBytes = aesjs.utils.hex.toBytes(otp.otp);
      var aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5));
      var decryptedBytes = aesCtr.decrypt(encryptedBytes);
      var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
      
      if(recievedotp===decryptedText ) {
        if(amount>balance) {
          return {message:'Transaction cancelled. Your spent exceeds your balance.',success:false};
        } else {
           User.updateOne({_id:uid},{balance: balance - amount},(error, response) => {
            if(response) {
              console.log("response =>",response);
            } if(error) {
              console.log("error =>",error);
            }
          })
          return {message:`Transaction successful. Your Remaining Balance is ${balance - amount}`,success:true};
        } 
      } else 
      {
        return {message:'Otp does not match. Please try again.', success:false};
      }
    } else {
      return {message:'Time for otp is expired. Please try again later.',success:false};
    }
  } catch(error) {
    return {message:error, success:false}
  }
}

function otpencrypt(otp) {
  var key_256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  var textBytes = aesjs.utils.utf8.toBytes(otp);
  var aesCtr =  new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5));
  var encryptedBytes =  aesCtr.encrypt(textBytes);
  var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex;
}

router.post('/otpgeneration',accountcheck, async (req, res) => {
  var chk = req.body.chk;
  var sms='';
  console.log(req.user,chk);
      
  try {
    if(chk === 1) {
      const otpp = "" + getRandomInt(10)  + getRandomInt(10) + getRandomInt(10) + getRandomInt(10) + getRandomInt(10) + getRandomInt(10);
      const encryptedOtp = otpencrypt(otpp);
      const otp = await new Otp({userid: req.user._id, otp:encryptedOtp, otp_present: true});
      await otp.save(); 
      const newotp = await Otp.findOne({userid:req.user._id});
      console.log('otp =>',otp,newotp);
      sms = "The otp for the transaction is "+ otpp + " and is valid for only 5 minutes.";
    }
    else if(chk===2) {
      
      var sms = await compareOtp(req.body.otp, req.user._id, req.body.amount, req.user.balance);
      console.log('sms =>',sms);
    }
    console.log("sms ===>",sms);
    res.status(200).send({message:sms});
    // client.messages
    //   .create({
    //      body: sms,
    //      from: '+13017602048',
    //      statusCallback: 'http://postb.in/1234abcd',
    //      to: `+${req.user.number}`
    //    })
    //   .then(message => {
    //     console.log(message);
    //     res.status(200).send({message:sms});
    //   });
     // res.status(400).send({otp});
  } catch(error) {
    console.log(error);
    res.status(400).send({error});
  }
})

module.exports = router;