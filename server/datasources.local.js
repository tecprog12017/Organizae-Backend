module.exports = {
  db: {
    connector: 'mongodb',
    hostname: process.env.OPENSHIFT_MONGODB_DB_HOST,
    port: process.env.OPENSHIFT_MONGODB_DB_PORT || 27017,
    user: process.env.OPENSHIFT_MONGODB_DB_USERNAME,
    password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD,
    database: 'organizae'
  }
};

console.log(process.env.OPENSHIFT_MONGODB_DATABASE);
