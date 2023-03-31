const { ObjectId } = require('mongoose').Types;
const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
        });
        await product.save();
        res.send(product);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al crear producto');
    }
};

exports.getProducts = async (req, res) => {
    const products = await Product.find().select('-__v');
    res.send(products);
};

exports.getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!ObjectId.isValid(productId)) {
            return res.status(400).send('Id no valido');
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.send(product);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al buscar el producto');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!ObjectId.isValid(productId)) {
            return res.status(400).send('Id no valido');
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        await product.remove();
        res.send('Producto eliminado');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al eliminar producto');
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { body } = req;
        const productActualizado = await Product.findOneAndUpdate({ _id: body._id }, body, { new: true });
        res.send(productActualizado);
    } catch (error) {
        console.log(error);
    }
}