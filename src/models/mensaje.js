const mongoose = require('mongoose');
const Schema = mongoose.Schema

const mensaje_squema = new Schema({
    sala_id :{
        type : String,
        require : true,
    },
    content :{
        type : String,
        require : true
    },
}, {timestamps : true});

const Mensaje = mongoose.model('mensaje', mensaje_squema);
module.exports = Mensaje;