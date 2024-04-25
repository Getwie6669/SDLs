// connection postgres
const Sequelize = require('sequelize');

console.log(process.env.PG_DB,process.env.PG_USER,process.env.PG_PASSWORD,)

const sequelize = new Sequelize(
    process.env.PG_DB,
    process.env.PG_USER,
    process.env.PG_PASSWORD,
    {
        host: process.env.PG_HOST,
        dialect:'postgres',
    },
    
);

module.exports = sequelize;