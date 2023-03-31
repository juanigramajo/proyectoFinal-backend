const express = require('express');
const router = express.Router();
const mensajeController = require('../controllers/mensajeController');
const auth = require('../middlewares/auth');

router.post('/', mensajeController.crearMensaje);
router.get('/', auth, mensajeController.obtenerMensajes);
router.delete('/:mensajeId', auth, mensajeController.deleteMensaje);

module.exports = router;