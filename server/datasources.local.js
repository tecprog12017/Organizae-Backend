module.exports = {
  organizae: {
    name: "organizae",
    connector: 'mongodb',
    host: process.env.MONGODB_SERVICE_HOST || '127.0.0.1',
    port: process.env.MONGODB_SERVICE_PORT,
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
    database: 'organizae'
  }
};
