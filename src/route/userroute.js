const User = require('../database/usermodel');
const express = require('express');
const router = new express.Router();
const accountcheck = require('../middleware/mlogin');

router.post('/bankdetail', async (req, res) => {
    const user = new User(req.body);
    try {
      await user.save();
      return res.status(201).send({ user });
    } catch (e) {
      console.log(e);
      return res.status(400).send({ error: e });
    }
  });
  
router.post('/bankauthentication',accountcheck, async (req,res) => {
  const users = new User(req.user);
  try {
      const isMatch = User.checkCredentials(req.body.userid,req.body.password,users);
      isMatch.then((a) => {
        if(a) {
          res.status(200).send({'message':'Authenticated'});
          } else {
            res.status(404).send({'message':'Check your credentials'});
          }
      }).catch(error => {
        console.log(error);
      })
      
  } catch(error) {
    res.status(400).send({error});
  }
});


module.exports = router;