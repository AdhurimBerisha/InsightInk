import mysql from "mysql2";

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "adhurimbe12",
  database: "insightink",
});

const mysqlConnection = () => {
  return pool;
};

export default mysqlConnection;
