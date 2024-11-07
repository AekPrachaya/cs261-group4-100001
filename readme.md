# TU Petition
This project is a Petition Submission System for TU students by Group 4, CS261.
### For developer
- Clone project
`git clone https://github.com/AekPrachaya/cs261-group4-100001.git`

- setup environment variables in .env according to [.env.example](https://github.com/AekPrachaya/cs261-group4-100001/blob/d9ac45c16d3f981ee151895be2e6221db2021a79/.env.example ".env.example")

- install [docker-compose](https://docs.docker.com/compose/install/)
- run docker-compose
`docker-compose up -d`
- install packages
`npm i`
- run project
`node ./index.js`

### Testing
`npm test`

### Request
`POST /api/petition/upload`

type: string: type of petition
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

[View type](https://github.com/AekPrachaya/cs261-group4-100001/blob/d9ac45c16d3f981ee151895be2e6221db2021a79/server/type.js)

------------


