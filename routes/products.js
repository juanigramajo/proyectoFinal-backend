const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const auth = require('../middlewares/auth');

router.post('/', auth, productsController.createProduct);
router.delete('/:productId', auth, productsController.deleteProduct);
router.get('/:productId', productsController.getProductById);
router.get('/', productsController.getProducts);
router.put('/:productId', auth, productsController.updateProduct);

module.exports = router;