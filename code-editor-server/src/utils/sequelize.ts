import { Sequelize } from 'sequelize';

const POSTGRES_URI=`postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
console.log(`Connecting to ${POSTGRES_URI}`)
const useSSL = process.env.USE_SSL === 'true'; 
console.log(`Using SSL: ${useSSL}`)


const dialectOptions = useSSL
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : {};

const sequelize = new Sequelize(POSTGRES_URI, {
  dialect: 'postgres',
  dialectOptions,
  logging: console.log,
});
  

export default sequelize;