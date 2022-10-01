import mysql from 'mysql2/promise';
import C from './constants';

const config: mysql.ConnectionOptions = {
  host: C.MySQL.host,
  user: C.MySQL.user,
  password: C.MySQL.password,
  database: C.MySQL.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

/**
 * SQL Table definitions
 * 
 * TABLE users
 * - username: TINYTEXT
 * - email: TINYTEXT
 * - password: TINYTEXT
 */


export const query = async (sql: string, values: any[] = []) => {
    const pool = await mysql.createConnection(config);
    await pool.connect();
    if(!values)
    {
        const [rows, fields] = await pool.query(sql).catch(async err => {
            console.error(err);
            await pool.end();
            throw err;
        });
    
        await pool.end();
        return rows;
    }

    //Create a prepared statement
    const [rows, fields] = await pool.execute(sql, values).catch(async err => {
        console.log(err);
        await pool.end();
        throw err;
    });

    await pool.end();
    return rows;
};

export const getUserData = (username: string) => query(`SELECT * FROM users WHERE username = ?`, [username]);
export const getUserDataByEmail = (email: string) => query(`SELECT * FROM users WHERE email = ?`, [email]);

export const createUser = (username: string, email: string, password: string) => query(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, [username, email, password]);
export const deleteUser = (username: string) => query(`DELETE FROM users WHERE username = ?`, [username]);

export const changePassword = (username: string, password: string) => query(`UPDATE users SET password = ? WHERE username = ?`, [password, username]);
export const changeEmail = (username: string, email: string) => query(`UPDATE users SET email = ? WHERE username = ?`, [email, username]);