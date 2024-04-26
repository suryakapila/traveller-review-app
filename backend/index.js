const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv');
const userRoutes =  require('./routes/users');
const pinRoutes = require('./routes/pins');
const user = require('./models/user');

const application = express();
application.use(express.json());

env.config();

mongoose.connect(process.env.MONGO_DB_URI)
.then(() =>{console.log('\x1b[42m%s\x1b[0m','[Success] Connected to MongoDB')})
.catch((err) => {console.log('\x1b[41m%s\x1b[0m','Error connecting to MongoDB', err)});

application.use('/api/users', userRoutes);
application.use('/api/pins', pinRoutes);

application.listen(7800, () => {
    console.log('\x1b[42m%s\x1b[0m', '[Success] Server is running on port 7800')
});