# TU Petition

This project is a Petition Submission System for TU students by Group 4, CS261.

## Installation

Clone project

```bash
git clone https://github.com/AekPrachaya/cs261-group4-100001.git
```

Install packages

```bash
npm i
```

Setup environment variables in .env according to [.env.example](https://github.com/AekPrachaya/cs261-group4-100001/blob/d9ac45c16d3f981ee151895be2e6221db2021a79/.env.example ".env.example")

Install [docker-compose](https://docs.docker.com/compose/install/) and run docker-compose

```bash
docker-compose up -d
```

Start dev server of the project

```bash
npm run dev
```

## Page

This section provides quick access to different parts of the platform

`/`

Login page for user authentication.

`/petition`

Petition Status page to view and track the status of user-submitted petitions.

`/profile`

User Profile page and displaying user information

`/request`

Online Petition Submission page, allowing users to create and submit petitions directly through the platform.

## Request

### Auth

`POST /api/login`

username: string

password: string

`GET /api/logout`

log current user out

`GET /api/session`

get current session

### User

POST `/api/user`

> [!require]
>
> - username: String {username}
> - password: String {password}
> - role: String {user role}

DELETE `/api/user/:username`

> [!require]
>
> Success
>
> - username: String {if role = staff}

### Petition

POST `/api/petition`

> [!require]
>
> - type: String {add/remove}
> - content: Object {petition}

> [!return]
>
> Success //contain inserted petition data
>
> - id: petition_id
> - type: petition_type
> - content: petition_content

GET `api/petition/:id`

> [!require]
>
> - id: int {petition id}

> [!return]
>
> Success
>
> - id: petition_id
> - type: petition_type
> - content: petition_content

GET `/api/petitions/:student_id`

> [!require]
>
> - student_id: int {student id}

> [!return]
>
> Success
>
> - id: petition_id
> - type: petition_type
> - content: petition_content

DELETE `/api/petition/:id`

> [!require]
>
> - id: int {petition id}

> [!return]
>
> - id: petition_id
> - status : "Deleted successfully"

PUT `/api/petition`

> [!require]
>
> - id: int {petition id}
> - petition: object {updated petition}

> [!return]
>
> - id: petition_id
> - type: updated_type
> - content: updated_content

### Comment

POST `/api/comment` inserts a new comment to database

> [!require]
>
> comment: String

> [!return]
>
> Success //contain inserted comment data
>
> - id: comment_id
> - comment: comment_text
>   Error
> - error: comment is required

GET `/api/comment/:id`

> [!return]
>
> Success //contain fetched comment data
>
> - id: comment_id
> - comment: comment_text
>   Error
> - error: ID is required

PUT `/api/comment`

> [!return]
>
> Success //contain updated comment data
>
> - id: comment_id
> - comment: Update_comment_text

[View type](https://github.com/AekPrachaya/cs261-group4-100001/blob/d9ac45c16d3f981ee151895be2e6221db2021a79/server/type.js)
