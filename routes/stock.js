const express = require('express');
const { createStock, updateStock, getStock } = require('../models/stock');

const router = express.Router();

router.post('/', async (req, res) => {
  const { productId, shopId, quantityOnShelf, quantityInOrder } = req.body;
  try {
    const stock = await createStock(productId, shopId, quantityOnShelf, quantityInOrder);
    res.status(201).json(stock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Increase stock
router.patch('/increase', async (req, res) => {
  const { stockId, quantityOnShelf, quantityInOrder } = req.body;
  try {
    const stock = await updateStock(stockId, quantityOnShelf, quantityInOrder);
    res.json(stock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const filters = req.query;
  try {
    const stock = await getStock(filters);
    res.json(stock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const deletedStock = await deleteStock(id);
      if (!deletedStock) {
          return res.status(404).json({ error: 'Stock entry not found' });
      }
      res.json(deletedStock);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete stock entry' });
  }
});


module.exports = router;
