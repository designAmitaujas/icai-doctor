import { DataSource } from "typeorm";
import { User } from "./entities/User.js";
import { DB_NAME, DB_PASS, DB_USER } from "./env.js";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User],
  subscribers: [],
  migrations: [],
});
