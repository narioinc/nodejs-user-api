module.exports = {
    DB_HOST: process.env.DB_HOST || "127.0.0.1",
    DB_PORT: process.env.DB_PORT  || "60636",
    DB_USER: process.env.DB_USER || "root",
    DB_PASSWORD: process.env.DB_PWD || "password",
    DB: process.env.DB_NAME || "usermanagement", 
    dialect: process.env.DB_DIALECT || "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };