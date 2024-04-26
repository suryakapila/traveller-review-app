const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pinSchema = new Schema({
    userName: {
        type: String,
        required: true,
        min: 3,
    },
    title: {
        type: String,
        required: true, min:3,
    },
    desc: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude:{
        type: Number,
        required: true
    },
}, {timestamps: true});

module.exports = mongoose.model('Pin', pinSchema);