// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/users.db3'
    },
    migrations: {
      directory: './data/migrations'
    },
    pool : {
      afterCreate: (conn, done) => {
        conn.run('PRAGMA foregin_keys = ON', done)
      }
    }
  },
};