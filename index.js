const express = require('express');
require('./src/database/mongoose');

const app = express();
const User = require('./src/route/userroute');
app.use(express.json());
app.use(User);

const port = process.env.PORT || 3000;

app.listen(port, console.log(`Server started on ${port}`));