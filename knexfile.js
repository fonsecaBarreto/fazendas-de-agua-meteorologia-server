const {config} = require('dotenv')
config()

module.exports = {
  test: {
    client: "pg",
    connection: {
      host : '127.0.0.1',
      user : 'lucas',
      password : '123456',
      database : 'fazenda_test'
    },
    migrations: {
      directory: __dirname + "/db/migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds",
    },
  },

  development: {
    client: "pg",
    connection: {
      host : '127.0.0.1',
      user : 'lucas',
      password : '123456',
      database : 'fazenda_dev'
    },
    migrations: {
      directory: __dirname + "/db/migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds",
    },
  },

 /*  stage: {
    client: "pg",
    connection: {
      connectionString: process.env.STAGE_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: __dirname + "/db/migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds",
    },
  },

  production: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: __dirname + "/db/migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds",
    },
  }, */

};
