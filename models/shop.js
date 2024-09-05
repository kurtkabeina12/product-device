const pool = require('../db');

const createShop = async (name) => {
  const result = await pool.query(
    'INSERT INTO shops (name) VALUES (\$1) RETURNING *',
    [name]
  );
  return result.rows[0];
};

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

const getShopById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM shops WHERE id = \$1',
    [id]
  );
  return result.rows[0];
};

const updateShop = async (id, name) => {
  const result = await pool.query(
    'UPDATE shops SET name = \$1 WHERE id = \$2 RETURNING *',
    [name, id]
  );
  return result.rows[0];
};

const deleteShop = async (shopId) => {
  const client = await pool.connect();
  try {
      await client.query('BEGIN');
      await client.query('DELETE FROM stock WHERE shop_id = \$1', [shopId]);
      await client.query('DELETE FROM action_history WHERE shop_id = \$1', [shopId]);
      const result = await client.query('DELETE FROM shops WHERE id = \$1 RETURNING *', [shopId]);
      if (result.rows.length === 0) {
          throw new Error('Shop not found');
      }
      await client.query('COMMIT');
      return result.rows[0];
  } catch (error) {
      await client.query('ROLLBACK');
      throw error;
  } finally {
      client.release();
  }
};

module.exports = { createShop, getShops, getShopById, updateShop, deleteShop };