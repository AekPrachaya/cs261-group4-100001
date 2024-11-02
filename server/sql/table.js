export const CREATE_PETITION_TABLE = `CREATE TABLE IF NOT EXISTS petitions (
    id UUID PRIMARY KEY,
    student_id INT NOT NULL,
    type TEXT NOT NULL,
    advisor TEXT NOT NULL,
    documents INT[],
    content JSONB NOT NULL
)`
