import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST || "database",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  username: process.env.DB_USER || "app",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_NAME || "biblioteca",
  timezone: "-03:00",
  dialectOptions: {
    useUTC: false,
    timezone: "-03:00",
  },
  logging: false
});

export default sequelize;
