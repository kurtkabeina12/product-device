const pool = require('../db');

const createProduct = async (plu, name) => {
  try {
    const existingProduct = await pool.query(`
      SELECT * FROM products WHERE plu = \$1;
    `, [plu]);

    if (existingProduct.rows.length > 0) {
      return updateProduct(plu, name);
    }

    const result = await pool.query(`
      INSERT INTO products (plu, name) VALUES (\$1, \$2) RETURNING *;
    `, [plu, name]);

    return result.rows[0];
  } catch (err) {
    console.error('Error creating/updating product:', err);
    throw err;
  }
};

const updateProduct = async (plu, name) => {
  const result = await pool.query(
    'UPDATE products SET name = \$2 WHERE plu = \$1 RETURNING *',
    [plu, name]
  );
  return result.rows[0];
};


const getProducts = async (filters) => {
  const { plu, name } = filters;
  let query = 'SELECT * FROM products WHERE 1=1';
  const values = [];

  if (plu) {
    values.push(plu);
    query += ` AND plu = $${values.length}`;
  }

  if (name) {
    values.push(`%${name}%`);
    query += ` AND name ILIKE $${values.length}`;
  }

  const result = await pool.query(query, values);
  return result.rows;
};

const deleteProduct = async (id) => {
  if (!id) {
    throw new Error('ID is required');
  }
  
  const result = await pool.query(
    'DELETE FROM products WHERE id = \$1 RETURNING *',
    [id]
  );
  
  if (result.rows.length === 0) {
    console.warn(`Product with ID ${id} not found`);
    throw new Error('Product not found');
  }
  
  return result.rows[0];
};


module.exports = { createProduct, getProducts, deleteProduct };