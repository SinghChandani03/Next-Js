// db.js

import mysql from 'mysql';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '@Chandani12345',
  database: 'school',
});

export default pool;
