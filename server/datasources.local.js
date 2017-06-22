module.exports = {
  organizae: {
    name: "organizae",
    connector: 'mongodb',
    host: process.env.MONGODB_SERVICE_HOST,
    port: process.env.MONGODB_SERVICE_PORT,
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_ADMIN_PASSWORD,
    database: 'organizae'
  }
};
