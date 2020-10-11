const Sequelize = require('sequelize');
const dotenv = require ( 'dotenv' ).config();

const user_db = process.env.USER_DB;
const password_db = process.env.PASSWORD_DB;
const sequelize = new Sequelize( "delilah", user_db, password_db, {
    host: "localhost",
    dialect: "mariadb",
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// sequelize.sync({ force: false }).then(() => {
//     console.info("Tablas sincronizadas");
// }).catch(console.error);

module.exports = sequelize;