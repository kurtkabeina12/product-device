const express = require('express');
const { createProduct, getProducts, deleteProduct } = require('../models/product');
const router = express.Router();

router.post('/', async (req, res) => {
    const { plu, name } = req.body;
    try {
      const product = await createProduct(plu, name);
      res.status(201).json(product);
    } catch (err) {
      console.error('Error creating product:', err);
      res.status(500).json({ error: err.message });
    }
  });

router.get('/', async (req, res) => {
    const filters = req.query;
    try {
        const products = await getProducts(filters);
        res.json(products);
    } catch (err) {
        console.error('Error retrieving products:', err); 
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const deletedProduct = await deleteProduct(id);
      if (!deletedProduct) {
          return res.status(404).json({ error: 'Product not found' });
      }
      res.json(deletedProduct);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete product' });
  }
});


module.exports = router;