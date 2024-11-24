export const CREATE_PETITION_TABLE = `CREATE TABLE IF NOT EXISTS petitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    type TEXT NOT NULL,
    advisor TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending','approved', 'rejected')) DEFAULT 'pending',
    content JSONB NOT NULL
)`;

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

    dean_comment TEXT,
    dean_signature TEXT,
    dean_date TIMESTAMP
)`;

export const CREATE_DOCUMENT_TABLE = `CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    petition_id UUID NOT NULL REFERENCES petitions(id) ON DELETE CASCADE,
    public_id TEXT NOT NULL
)`;

export const CREATE_USER_TABLE = `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('advisor', 'staff', 'instructor', 'dean'))
)`;

export const CREATE_APPROVAL_TABLE = `CREATE TABLE IF NOT EXISTS approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    petition_id UUID NOT NULL REFERENCES petitions(id) ON DELETE CASCADE,
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,

    advisor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    advisor_status TEXT NOT NULL DEFAULT 'waiting' CHECK (advisor_status IN ('approved', 'rejected', 'waiting')),
    advisor_date TIMESTAMP,

    staff_id UUID  REFERENCES users(id) ON DELETE CASCADE,
    staff_status TEXT NOT NULL DEFAULT 'waiting' CHECK (staff_status IN ('approved', 'rejected', 'waiting')),
    staff_date TIMESTAMP,

    instructor_id UUID  REFERENCES users(id) ON DELETE CASCADE,
    instructor_status TEXT NOT NULL DEFAULT 'waiting' CHECK (instructor_status IN ('approved', 'rejected', 'waiting')),
    instructor_date TIMESTAMP,

    dean_id UUID  REFERENCES users(id) ON DELETE CASCADE,
    dean_status TEXT NOT NULL DEFAULT 'waiting' CHECK (dean_status IN ('approved', 'rejected', 'waiting')),
    dean_date TIMESTAMP
)`;
