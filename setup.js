const pool = require('./db');

const setupDatabase = async () => {
	try {
		await pool.query(`
CREATE TABLE shops(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
        `);

		await pool.query(`
        CREATE TABLE products (
            id SERIAL PRIMARY KEY,
            plu VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255) NOT NULL
          );
        `);

		await pool.query(`
        CREATE TABLE stock(
            id SERIAL PRIMARY KEY,
            product_id INTEGER NOT NULL,
            shop_id INTEGER NOT NULL,
            quantity_on_shelf INTEGER NOT NULL,
            quantity_in_order INTEGER NOT NULL,
            FOREIGN KEY(product_id) REFERENCES products(id),
            FOREIGN KEY(shop_id) REFERENCES shops(id)
        );
        `);

		await pool.query(`
        CREATE TABLE action_history(
            id SERIAL PRIMARY KEY,
            shop_id INTEGER NOT NULL,
            plu VARCHAR(255) NOT NULL,
            action VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(shop_id) REFERENCES shops(id)
        );        
        `);

		await pool.query("INSERT INTO shops (name) VALUES (\$1) ON CONFLICT DO NOTHING", ['Shop 1']);
		await pool.query("INSERT INTO products (plu, name) VALUES (\$1, \$2) ON CONFLICT DO NOTHING", ['123456', 'Product 1']);
		await pool.query("INSERT INTO stock (product_id, shop_id, quantity_on_shelf, quantity_in_order) VALUES (\$1, \$2, \$3, \$4) ON CONFLICT DO NOTHING", [1, 1, 100, 10]);

		console.log("Database setup complete!");
	} catch (error) {
		console.error("Error setting up the database:", error);
	} finally {
		pool.end();
	}
};

setupDatabase();