const pool = require('../db');

interface ActionHistory {
  id: number;
  shop_id: number;
  plu: string;
  action: string;
  created_at: Date;
}

export const logAction = async (shopId: number, plu: string, action: string): Promise<ActionHistory> => {
  const result = await pool.query(
    'INSERT INTO action_history (shop_id, plu, action, created_at) VALUES (\$1, \$2, \$3, NOW()) RETURNING *',
    [shopId, plu, action]
  );
  return result.rows[0];
};

export const getActionHistory = async (filters: {
  shop_id?: number;
  plu?: string;
  startDate?: string;
  endDate?: string;
  action?: string;
}): Promise<ActionHistory[]> => {
  const { shop_id, plu, startDate, endDate, action } = filters;
  let query = 'SELECT * FROM action_history WHERE 1=1';
  const values: (number | string)[] = [];

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