import express, { Request, Response } from 'express';
import { logAction, getActionHistory } from '../models/actionHistory';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const { shopId, plu, action } = req.body;
  try {
    const history = await logAction(shopId, plu, action);
    res.status(201).json(history);
  } catch (err) {
    console.error('Failed to log action:', err);
    res.status(500).json({ error: 'Failed to log action' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  const filters = req.query;
  try {
    const history = await getActionHistory(filters);
    res.json(history);
  } catch (err) {
    console.error('Failed to retrieve action history:', err);
    res.status(500).json({ error: 'Failed to retrieve action history' });
  }
});

export default router; 