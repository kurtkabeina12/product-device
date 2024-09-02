const pool = require('../db');

const logAction = async (shopId, plu, action) => {
  const result = await pool.query(
    'INSERT INTO action_history (shop_id, plu, action, created_at) VALUES (\$1, \$2, \$3, NOW()) RETURNING *',
    [shopId, plu, action]
  );
  return result.rows[0];
};

const getActionHistory = async (filters) => {
  const { shop_id, plu, startDate, endDate, action } = filters;
  let query = 'SELECT * FROM action_history WHERE 1=1';
  const values = [];

  if (shop_id) {
    values.push(shop_id);
    query += ` AND shop_id = $${values.length}`;
  }

  if (plu) {
    values.push(plu);
    query += ` AND plu = $${values.length}`;
  }

  if (startDate) {
    values.push(startDate);
    query += ` AND created_at >= $${values.length}`;
  }

  if (endDate) {
    values.push(endDate);
    query += ` AND created_at <= $${values.length}`;
  }

  if (action) {
    values.push(action);
    query += ` AND action = $${values.length}`;
  }

  const result = await pool.query(query, values);
  return result.rows;
};

module.exports = { logAction, getActionHistory };