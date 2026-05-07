import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { generateRandomId } from "../utils.js";
import { Event } from "./Event.js";

@Entity()
export class EventAttachment extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  attendanceSheetPath!: string;

  @Column()
  annexurePath!: string;

  @Column()
  eventImagePath!: string;

  @ManyToOne(() => Event, (event) => event.attachments, { onDelete: "CASCADE" })
  event!: Relation<Event>;

  @CreateDateColumn()
  createdAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @BeforeInsert()
  generateId() {
    this.id = generateRandomId();
  }
}
