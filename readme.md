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


### Petition

`POST /api/petition/upload`

type: string

content: Petition

`POST /api/petition/get`

id: string

`POST /api/petition/get_all`

student_id: string

`PUT /api/petition/`

id: string (petition_id)

content: Content

`DELETE /api/petition/`

id: string (petition_id)

### Comment

`POST /api/comment/add`

comment: Comment

`POST /api/comment/get`

petition_id: string

`POST /api/comment/update`

comment: Comment

[View type](https://github.com/AekPrachaya/cs261-group4-100001/blob/d9ac45c16d3f981ee151895be2e6221db2021a79/server/type.js)
