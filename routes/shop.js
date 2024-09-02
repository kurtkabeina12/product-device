const express = require('express');
const { createShop, getShops, getShopById, updateShop, deleteShop } = require('../models/shop');
const router = express.Router();

router.post('/', async (req, res) => {
    const { name } = req.body;
    try {
        const shop = await createShop(name);
        res.status(201).json(shop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create shop' });
    }
});

router.get('/', async (req, res) => {
    const filters = req.query;
    try {
        const shops = await getShops(filters);
        res.json(shops);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve shops' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const shop = await getShopById(id);
        if (shop) {
            res.json(shop);
        } else {
            res.status(404).json({ error: 'Shop not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve shop' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updatedShop = await updateShop(id, name);
        if (updatedShop) {
            res.json(updatedShop);
        } else {
            res.status(404).json({ error: 'Shop not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update shop' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedShop = await deleteShop(id);
        if (!deletedShop) {
            return res.status(404).json({ error: 'Shop not found' });
        }
        res.json(deletedShop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete shop' });
    }
});

module.exports = router;