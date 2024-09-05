const express = require('express');
const productRoutes = require('./routes/product.js');
const stockRoutes = require('./routes/stock.js');
const actionHistoryRoutes = require('./dist/routes/actionHistory').default; 
const shopRoutes = require('./routes/shop.js'); 

const app = express();
app.use(express.json());

app.use('/products', productRoutes);
app.use('/stock', stockRoutes);
app.use('/action-history', actionHistoryRoutes);
app.use('/shops', shopRoutes);

const PORT = process.env.PORT || 3000;

const startServer = () => {
    return app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

module.exports = { app, startServer };