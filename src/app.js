import express from 'express';
import ProductManager from './index.js'



const app = express();
const PORT = 3000;


app.get('/products', async (req, res) => {
    try {
        const productManager = new ProductManager('./products.json');
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        let products = await productManager.getProducts();

        if (limit) {
            products = products.slice(0, limit);
        }

        res.json({ products });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/products/:pid', async (req, res) => {
    try {
        const productManager = new ProductManager('./products.json');
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        if (!product) {
            res.status(404).json({ error: `Product with ID ${productId} not found` });
        } else {
            res.json({ product });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
