const bcryptjs = require('bcryptjs');
const Usuario = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;


exports.crearUsuario = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        console.log(errores.array())
        return res.status(400).send({ msg: errores.array() });
    }

    const { email, password } = req.body;
    try {
        const usuarioEncontrado = await Usuario.findOne({ email });
        if (usuarioEncontrado) {
            return res.status(400).send('El correo ya está en uso.');
        }

        //hashear el password
        const salt = await bcryptjs.genSalt(10);
        const encryptedPass = await bcryptjs.hash(password, salt);

        const usuario = new Usuario({
            ...req.body,
            createdAt: Date.now(),
            password: encryptedPass,
        });
        await usuario.save();

        // Crear y firmar jwt
        const payload = {
            usuario: {
                id: usuario.id,
            },
        };
        jwt.sign(payload, process.env.SECRETA, { expiresIn: 3600 }, (error, token) => {
            if (error) {
                throw error;
            }
            res.send(token);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error al crear usuario.');
    }
};

exports.obtenerUsuarios = async (req, res) => {
    const usuarios = await Usuario.find().select('-__v');
    res.send(usuarios)
};


exports.actualizarUsuarioLogueado = async (req, res) => {
    try {
        const { body, usuario } = req;
        if (body.password) {
            //hashear el password
            const salt = await bcryptjs.genSalt(10);
            const encryptedPass = await bcryptjs.hash(body.password, salt);
            body.password = encryptedPass;
        }
        const usuarioActualizado = await Usuario.findOneAndUpdate({ _id: usuario.id }, body, { new: true });
        res.send(usuarioActualizado);
    } catch (error) {
        console.log(error);
    }
};

exports.eliminarUsuario = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!ObjectId.isValid(userId)) {
            return res.status(400).send('Id no valido');
        }

        const user = await Usuario.findById(userId);

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        
        // CONDICIONAL PARA CHEQUEAR QUE SEA ADMIN!
        // if (user.creador.equals(req.usuario.id)) {
        //     return res.status(403).send('No tiene permisos para borrar el usuario');
        // }

        await user.remove();
        res.send('Usuario eliminado');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al eliminar usuario');
    }
};

exports.usuarioLogueado = async (req, res) => {
    const usuarioEncontrado = await Usuario.findById(req.usuario.id).select('email nombre imagen rol');
    res.send(usuarioEncontrado);
};
