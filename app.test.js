const request = require('supertest');
const { app, startServer } = require('./index'); 

let server;

beforeAll(async () => {
    server = startServer(); 
});

afterAll(async () => {
    await server.close(); 
});

describe('API Tests', () => {
    let shopId;
    let productId;
    let stockId;

    test('POST /shops - Create a new shop', async () => {
        const response = await request(app)
            .post('/shops')
            .send({ name: 'Test Shop' });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('Test Shop');
        shopId = response.body.id; 
    });

    test('GET /shops - Get all shops', async () => {
        const response = await request(app).get('/shops');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /products - Create a new product', async () => {
        const response = await request(app)
          .post('/products')
          .send({ plu: '123456', name: 'Test Product' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        productId = response.body.id;
      });

    test('GET /products - Get all products', async () => {
        const response = await request(app).get('/products');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /stock - Create stock for a product', async () => {
        const response = await request(app)
            .post('/stock')
            .send({ productId, shopId, quantityOnShelf: 100, quantityInOrder: 10 });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        stockId = response.body.id;
    });

    test('GET /stock - Get all stock', async () => {
        const response = await request(app).get('/stock');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /action-history - Log an action', async () => {
        const response = await request(app)
            .post('/action-history')
            .send({ shopId, plu: '123456', action: 'Added stock' });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    test('GET /action-history - Get action history', async () => {
        const response = await request(app).get('/action-history');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('PUT /shops/:id - Update a shop', async () => {
        const response = await request(app)
            .put(`/shops/${shopId}`)
            .send({ name: 'Updated Test Shop' });
        
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Updated Test Shop');
    });

    test('DELETE /shops/:id - Delete a shop', async () => {
        const response = await request(app).delete(`/shops/${shopId}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    });

    test('DELETE /products/:id - Delete a product', async () => {
        const response = await request(app).delete(`/products/${productId}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    });

    test('DELETE /stock/:id - Delete stock', async () => {
        const response = await request(app).delete(`/stock/${stockId}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    });
});