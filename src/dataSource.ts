import { DataSource } from "typeorm";
import { BankDetail } from "./entities/BankDetail.js";
import { Event } from "./entities/Event.js";
import { EventAttachment } from "./entities/EventAttachment.js";
import { User } from "./entities/User.js";
import { Video } from "./entities/Video.js";
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
  entities: [User, BankDetail, Event, EventAttachment, Video],
  subscribers: [],
  migrations: [],
});
