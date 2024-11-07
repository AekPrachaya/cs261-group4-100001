import { expect } from 'chai';
import pg from 'pg';
import { POSTGRESQL_URL } from '../config.js';

const { Pool } = pg;

const pool = new Pool({
    connectionString: POSTGRESQL_URL,
});

describe('Database Connection', () => {
    it('should establish a valid connection to the database', async () => {
        try {
            const client = await pool.connect();
            expect(client).to.not.be.null;
            client.release();  // release the client back to the pool
        } catch (error) {
            throw new Error(`Failed to connect to the database: ${error.message}`);
        }
    });

    it('should be able to execute a simple query', async () => {
        try {
            const { rows } = await pool.query('SELECT 1 + 1 AS result');
            expect(rows[0].result).to.equal(2); // Verify the result of the query
        } catch (error) {
            throw new Error(`Database query failed: ${error.message}`);
        }
    });

    after(async () => {
        await pool.end();  // Close the pool after tests
    });
});
