import mysql2 from "mysql2"

const poolCon = mysql2.createPool({
    host:'localhost',
    user:'root',
    password:'123',
    database:'devmind'
}).promise()

export default poolCon