import User from '../types/user.type';
import db from '../database';
import config from '../config';
import bcrypt from 'bcrypt';

const hashPassword = (password: string) => {
  const salt = parseInt(config.salt as string, 10);
  return bcrypt.hashSync(`${password}${config.pepper}`, salt);
};

class UserModel {
  // create
  async create(u: User): Promise<User> {
    try {
      // open connection with database
      const connection = await db.connect();
      const sql = `INSERT INTO users (email, user_name, first_name, last_name, password) 
      values ($1, $2, $3, $4, $5) returning id, email, user_name, first_name, last_name`;
      // run query
      const result = await connection.query(sql, [
        u.email,
        u.user_name,
        u.first_name,
        u.last_name,
        hashPassword(u.password),
      ]);
      // release connection
      connection.release();
      // return created user
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to create (${u.user_name}) : ${(error as Error).message}`
      );
    }
  }
  // get all users
  async getAllUsers(): Promise<User[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT id, email, user_name, first_name, last_name FROM users`;
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to retrieve users ${(error as Error).message}`);
    }
  }
  // get specific user
  async getUserByID(id: string): Promise<User> {
    try {
      const connection = await db.connect();
      const sql = `SELECT id, email, user_name, first_name, last_name FROM users WHERE id = ($1)`;
      const result = await connection.query(sql, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to retrieve user ${id}, ${(error as Error).message}`
      );
    }
  }
  // update user
  async updateUser(u: User): Promise<User> {
    try {
      const connection = await db.connect();
      const sql = `UPDATE users
      SET email=($1), user_name=($2), first_name=($3), last_name=($4), password=($5)
      WHERE id=($6)
      returning id, email, user_name, first_name, last_name`;
      const result = await connection.query(sql, [
        u.email,
        u.user_name,
        u.first_name,
        u.last_name,
        hashPassword(u.password),
        u.id,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to update user ${u.user_name}, ${(error as Error).message}`
      );
    }
  }
  // delete user
  async deleteUser(id: string): Promise<User> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM users
      WHERE id=($1)
      returning id, email, user_name, first_name, last_name`;
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to delete user ${id}, ${(error as Error).message}`
      );
    }
  }
  // Delete all Users
  // authenticate user
  async signIn(email: string, password: string): Promise<User | null> {
    try {
      const connection = await db.connect();
      const sql = `SELECT password FROM users WHERE email=$1`;
      const result = await connection.query(sql, [email]);
      if (result.rows.length) {
        const { password: hashPassword } = result.rows[0];
        const isPasswordValid = bcrypt.compareSync(
          `${password}${config.pepper}`,
          hashPassword
        );
        if (isPasswordValid) {
          const userInfo = await connection.query(
            `SELECT id, email, user_name, first_name, last_name FROM users WHERE email=($1)`,
            [email]
          );
          return userInfo.rows[0];
        }
      }
      connection.release();
      return null;
    } catch (error) {
      throw new Error(`Unable to sign in: ${(error as Error).message}`);
    }
  }
}

export default UserModel;
