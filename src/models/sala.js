const mongoose = require('mongoose');
const Schema = mongoose.Schema

const sala_squema = new Schema({
    name :{
        type : String,
        require : true
    },
    link :{
        type : String,
        require : false
    }
}, {timestamps : true});

const Sala = mongoose.model('sala', sala_squema);
module.exports = Sala;