module.exports = {
  mysql: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'chatapp',
    },
  },
  sqlite: {
    client: 'sqlite3',
    connection: {
      filename: './chatapp.sqlite',
    },
    useNullAsDefault: true,
  },
};
