import pg from 'pg'
import { CREATE_USER_TABLE, CREATE_COMMENT_TABLE, CREATE_DOCUMENT_TABLE, CREATE_PETITION_TABLE } from './sql/table.js'
import { POSTGRESQL_URL } from '../config.js'
if (!POSTGRESQL_URL) {
    throw new Error('Please set POSTGRESQL_URL environment variable')
}

const { Pool } = pg;
const POOL = new Pool({
    connectionString: POSTGRESQL_URL,
})

try {
    await POOL.connect();
} catch (error) {
    console.error('Error connecting to database', error)
}

await POOL.query(CREATE_PETITION_TABLE);
await POOL.query(CREATE_COMMENT_TABLE);
await POOL.query(CREATE_DOCUMENT_TABLE);
await POOL.query(CREATE_USER_TABLE);



export { POOL }
