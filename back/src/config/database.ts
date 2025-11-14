import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "biblioteca",
  timezone: "-03:00", // define o fuso horário para o Brasil (PT-BR)
  dialectOptions: {
    useUTC: false, // faz o Sequelize NÃO usar UTC
    timezone: "-03:00", // força o MySQL a salvar no fuso PT-BR
  },
});

export default sequelize;
