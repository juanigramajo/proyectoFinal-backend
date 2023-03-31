const Mensaje = require('../models/Mensaje');
const Usuario = require('../models/User');
const { ObjectId } = require('mongoose').Types;

exports.crearMensaje = async (req, res) => {
    try {
        const mensaje = new Mensaje({
            ...req.body,
            createdAt: Date.now(),
        });
        await mensaje.save();
        res.send(mensaje);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al enviar mensaje.');
    }
};

exports.obtenerMensajes = async (req, res) => {
    console.log(req.usuario);
    const usuario = await Usuario.findById(req.usuario.id);
    if (usuario.rol !== 'admin') {
        res.status(403).send('Error no tienen los permisos para visualizar los mensajes.')
        return
        
    }
    const mensajes = await Mensaje.find().select('-__v');
    res.send(mensajes);
};


exports.deleteMensaje = async (req, res) => {
    try {
        const { mensajeId } = req.params;
        if (!ObjectId.isValid(mensajeId)) {
            return res.status(400).send('Id no valido');
        }

        const mensaje = await Mensaje.findById(mensajeId);

        if (mensaje) {
            return res.status(404).send('Mensaje no encontrado');
        }

        await mensaje.remove();
        res.send('Mensaje eliminado');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al eliminar mensaje');
    }
};

