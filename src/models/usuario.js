const mongoose = require('mongoose');
const Schema = mongoose.Schema

const usuario_squema = new Schema({
    email :{
        type : String,
        require : true
    },
    password: {
        type: String,
        require : true
    }
}, {timestamps : true});

const Usuario = mongoose.model('usuario', usuario_squema);
module.exports = Usuario;