const User = require('../database/usermodel');

const accountcheck = async (req, res, next) => {
    const id = req.header('Authorization');
    try {
        const exist = await User.findOne({ _id: id});
        if(!exist) {
            return res.status(404).send({ error: 'Please authenticate'});
        }

        req.user = exist;
        next();
    } catch (e) {
        res.status(400).send({ error: 'Please authenticate'});
    }
};

module.exports  = accountcheck;