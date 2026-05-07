import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { generateRandomId } from "../utils.js";
import { Event } from "./Event.js";

@Entity()
export class Video extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  videoPath!: string;

  @ManyToOne(() => Event, (event) => event.videos, { onDelete: "CASCADE" })
  event!: Event;

  @CreateDateColumn()
  createdAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @BeforeInsert()
  generateId() {
    this.id = generateRandomId();
  }
}
