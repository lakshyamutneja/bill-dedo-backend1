const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

let mongouri = (process.env.NODE_ENV ==="production")?process.env.mongouri:'mongodb://127.0.0.1:27017'

mongoose
  .connect(mongouri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .catch(err => console.log(err));

mongoose.connection.on('error', err => {
  logError(err);
});
