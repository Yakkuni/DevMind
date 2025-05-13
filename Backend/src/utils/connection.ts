import mysql2 from "mysql2"

const poolCon = mysql2.createPool({
    host:'localhost',
    user:'root',
    password:'00000',
    database:'DevMind'
}).promise()

export default poolCon