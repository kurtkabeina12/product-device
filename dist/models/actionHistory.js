"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActionHistory = exports.logAction = void 0;
const pool = require('../../db');
const logAction = (shopId, plu, action) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query('INSERT INTO action_history (shop_id, plu, action, created_at) VALUES (\$1, \$2, \$3, NOW()) RETURNING *', [shopId, plu, action]);
    return result.rows[0];
});
exports.logAction = logAction;
const getActionHistory = (filters) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield pool.query(query, values);
    return result.rows;
});
exports.getActionHistory = getActionHistory;
