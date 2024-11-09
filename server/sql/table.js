export const CREATE_PETITION_TABLE = `CREATE TABLE IF NOT EXISTS petitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id INT NOT NULL,
    type TEXT NOT NULL,
    advisor TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    content JSONB NOT NULL
)`

export const CREATE_COMMENT_TABLE = `CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    petition_id UUID NOT NULL REFERENCES petitions(id) ON DELETE CASCADE,
    advisor_comment TEXT,
    advisor_date TIMESTAMP,

    staff_comment TEXT,
    staff_signature TEXT,
    staff_date TIMESTAMP,

    instructor_comment TEXT,
    instructor_signature TEXT,
    instructor_date TIMESTAMP,

    dean_status TEXT CHECK (dean_status IN ('approved', 'rejected', 'proceed')),
    dean_comment TEXT,
    dean_signature TEXT,
    dean_date TIMESTAMP
)`

export const CREATE_DOCUMENT_TABLE = `CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    petition_id UUID NOT NULL REFERENCES petitions(id) ON DELETE CASCADE,
    public_id TEXT NOT NULL
)`
