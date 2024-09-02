const pool = require('../db');

// Create a new shop
const createShop = async (name) => {
  const result = await pool.query(
    'INSERT INTO shops (name) VALUES (\$1) RETURNING *',
    [name]
  );
  return result.rows[0];
};

// Get shops with optional filters
const getShops = async (filters) => {
  const { name } = filters;
  let query = 'SELECT * FROM shops WHERE 1=1';
  const values = [];

  if (name) {
    values.push(`%${name}%`);
    query += ` AND name ILIKE $${values.length}`;
  }

  const result = await pool.query(query, values);
  return result.rows;
};

// Get a shop by ID
const getShopById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM shops WHERE id = \$1',
    [id]
  );
  return result.rows[0];
};

// Update a shop's name
const updateShop = async (id, name) => {
  const result = await pool.query(
    'UPDATE shops SET name = \$1 WHERE id = \$2 RETURNING *',
    [name, id]
  );
  return result.rows[0];
};

const deleteShop = async (id) => {
  if (!id) {
    throw new Error('ID is required');
  }
  
  const result = await pool.query(
    'DELETE FROM shops WHERE id = \$1 RETURNING *',
    [id]
  );
  
  if (result.rows.length === 0) {
    console.warn(`Shop with ID ${id} not found`);
    throw new Error('Shop not found');
  }
  
  return result.rows[0];
};


module.exports = { createShop, getShops, getShopById, updateShop, deleteShop };