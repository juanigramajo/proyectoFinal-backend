const mongoose = require('mongoose');

const mensajeSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    tipo: {
        type: String,
        required: true,
        trim: true,
    },
    contenido: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('Mensaje', mensajeSchema);
