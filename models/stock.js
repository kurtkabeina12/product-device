const pool = require('../db');

const createStock = async (productId, shopId, quantityOnShelf, quantityInOrder) => {
  if (!productId || !shopId) {
      throw new Error('Product ID and Shop ID are required');
  }

  console.log(`Creating stock for Product ID: ${productId}, Shop ID: ${shopId}, Quantity on Shelf: ${quantityOnShelf}, Quantity in Order: ${quantityInOrder}`);

  const existingStock = await pool.query(
      'SELECT * FROM stock WHERE product_id = \$1 AND shop_id = \$2',
      [productId, shopId]
  );

  if (existingStock.rows.length > 0) {
      return updateStock(existingStock.rows[0].id, quantityOnShelf, quantityInOrder);
  }

  const result = await pool.query(
      'INSERT INTO stock (product_id, shop_id, quantity_on_shelf, quantity_in_order) VALUES (\$1, \$2, \$3, \$4) RETURNING *',
      [productId, shopId, quantityOnShelf, quantityInOrder]
  );
  return result.rows[0];
};

const updateStock = async (stockId, quantityOnShelf, quantityInOrder) => {
  const result = await pool.query(
    'UPDATE stock SET quantity_on_shelf = \$1, quantity_in_order = \$2 WHERE id = \$3 RETURNING *',
    [quantityOnShelf, quantityInOrder, stockId]
  );
  return result.rows[0];
};

const getStock = async (filters) => {
  const { plu, shop_id, quantity_on_shelf_min, quantity_on_shelf_max, quantity_in_order_min, quantity_in_order_max } = filters;
  let query = `
    SELECT stock.*, products.plu, products.name, shops.name as shop_name
    FROM stock
    JOIN products ON stock.product_id = products.id
    JOIN shops ON stock.shop_id = shops.id
    WHERE 1=1
  `;
  const values = [];

  if (plu) {
    values.push(plu);
    query += ` AND products.plu = $${values.length}`;
  }

  if (shop_id) {
    values.push(shop_id);
    query += ` AND stock.shop_id = $${values.length}`;
  }

  if (quantity_on_shelf_min !== undefined) {
    values.push(quantity_on_shelf_min);
    query += ` AND stock.quantity_on_shelf >= $${values.length}`;
  }

  if (quantity_on_shelf_max !== undefined) {
    values.push(quantity_on_shelf_max);
    query += ` AND stock.quantity_on_shelf <= $${values.length}`;
  }

  if (quantity_in_order_min !== undefined) {
    values.push(quantity_in_order_min);
    query += ` AND stock.quantity_in_order >= $${values.length}`;
  }

  if (quantity_in_order_max !== undefined) {
    values.push(quantity_in_order_max);
    query += ` AND stock.quantity_in_order <= $${values.length}`;
  }

  const result = await pool.query(query, values);
  return result.rows;
};

const deleteStock = async (id) => {
  if (!id) {
      throw new Error('ID is required');
  }
  
  const result = await pool.query(
      'DELETE FROM stock WHERE id = \$1 RETURNING *',
      [id]
  );
  
  if (result.rows.length === 0) {
      console.warn(`Stock entry with ID ${id} not found`);
      return null; // Indicate that nothing was deleted
  }
  
  return result.rows[0];
};


module.exports = { createStock, updateStock, getStock, deleteStock };