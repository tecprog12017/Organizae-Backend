module.exports = {
  organizae: {
    connector: 'mongodb',
    hostname: process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost',
    port: process.env.OPENSHIFT_MONGODB_DB_PORT || 27017,
    user: process.env.OPENSHIFT_MONGODB_DB_USERNAME,
    password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD,
    database: 'organizae'
  }
};
