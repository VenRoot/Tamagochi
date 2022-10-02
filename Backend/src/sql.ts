import mariadb from "mariadb";
import C from './constants';
import { iUser } from "./interface/sql";

const mariaconfig: mariadb.PoolConfig = {
    host: C.MySQL.host,
    user: C.MySQL.user,
    password: C.MySQL.password,
    database: C.MySQL.database
};

//Regex for all .html files
const htmlRegex = /.*\.html$/;

const pool = mariadb.createPool(mariaconfig);

/**
 * SQL Table definitions
 * 
 * TABLE users
 * - username: TINYTEXT
 * - email: TINYTEXT
 * - password: TINYTEXT
 * - Sicherheitsfrage: TINYINT(4)
 * - Sicherheitsantwort: TINYTEXT
 */

export const query = async <T>(sql: string, values: string[] | number[] = []) => {
    const conn = await pool.getConnection();
    if (sql.includes("?") && values.length === 0) return Promise.reject(new Error("SQL query contains '?' but no values were provided"));
    try {
        const result = await conn.query(sql, values);
        return result as T;
    }
    catch(err) {
        console.log(err);
        return Promise.reject(new Error(err as any));
    }
    finally {
        if(conn) conn.release();
    }
}




export const getUserData = (usernameOrEmail: string) => query(`SELECT * FROM users WHERE username = ? OR email = ?`, [usernameOrEmail, usernameOrEmail]).catch(err => {throw err;});
export const getUserNameAndMail = (usernameOrEmail: string) => query(`SELECT username, email FROM users WHERE username = ? OR email = ?`, [usernameOrEmail, usernameOrEmail]).catch(err => {throw err;}) as Promise<{username: string, email: string}[]>;
export const getUserDataByEmail = (email: string) => query(`SELECT * FROM users WHERE email = ?`, [email]).catch(err => {throw err;});

export const createUser = (user: iUser) => query(`INSERT INTO users (username, email, password, Sicherheitsfrage, Sicherheitsantwort) VALUES (?, ?, ?, ?, ?)`, [user.username, user.email, user.password, user.Sicherheitsfrage, user.Sicherheitsantwort]).catch(err => {return Promise.reject(err);});
export const deleteUser = (username: string) => query(`DELETE FROM users WHERE username = ?`, [username]).catch(err => {throw err;});

export const changePassword = (username: string, password: string) => query(`UPDATE users SET password = ? WHERE username = ?`, [password, username]).catch(err => {throw err;});
export const changeEmail = (username: string, email: string) => query(`UPDATE users SET email = ? WHERE username = ?`, [email, username]).catch(err => {throw err;});



// // const config: mysql.ConnectionOptions = {
// //     host: C.MySQL.host,
// //     user: C.MySQL.user,
// //     password: C.MySQL.password,
// //     database: C.MySQL.database,
// //     waitForConnections: true,
// //     connectionLimit: 10,
// //     queueLimit: 0,
// // };


// // export const query = async (sql: string, values: any[] = []) => {
// //     const pool = await mysql.createConnection(config);
// //     await pool.connect();
// //     if (!values) {
// //         const [rows, fields] = await pool.query(sql).catch(async err => {
// //             console.error(err);
// //             await pool.end();
// //             throw err;
// //         });

// //         await pool.end();
// //         return rows;
// //     }

// //     //Create a prepared statement
// //     const [rows, fields] = await pool.execute(sql, values).catch(async err => {
// //         console.log(err);
// //         await pool.end();
// //         throw err;
// //     });

// //     await pool.end();
// //     return rows;
// // };