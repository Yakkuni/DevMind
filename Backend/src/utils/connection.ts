import mysql2 from "mysql2";
import dotenv from "dotenv";

dotenv.config(); // Carrega as variáveis do .env

const poolCon = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}).promise();

export default poolCon;
