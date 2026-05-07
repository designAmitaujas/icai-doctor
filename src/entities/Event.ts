import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { generateRandomId } from "../utils.js";
import { User } from "./User.js";
import { Video } from "./Video.js";

export enum EventType {
  CAREER_COUNSELLING = "CAREER COUNSELLING PROGRAMME",
  MEGA_CAREER_COUNSELLING = "MEGA CAREER COUNSELLING PROGRAMME",
  MAJOR_MEGA_EVENT = "MAJOR MEGA EVENT",
  SUPER_MEGA_CAREER_COUNSELLING = "SUPER MEGA CAREER COUNSELLING",
  CAREER_EDUCATION_FAIR = "CAREER / EDUCATION FAIR",
}

@Entity()
export class Event extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column({
    type: "enum",
    enum: EventType,
  })
  eventType!: EventType;

  @Column()
  eventName!: string;

  @Column()
  branch!: string;

  @Column()
  membershipNoCounsellor!: string;

  @Column()
  counsellorName!: string;

  @Column({ type: "date" })
  eventDate!: string;

  @Column({ type: "time" })
  startTime!: string;

  @Column({ type: "time" })
  endTime!: string;

  @Column()
  schoolCollegeName!: string;

  @Column()
  address!: string;

  @Column()
  streetAddress!: string;

  @Column()
  locality!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  country!: string;

  @Column()
  pinCode!: string;

  @Column({ type: "int" })
  expectedParticipants!: number;

  @Column()
  contactPersonName!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column()
  modeOfEvent!: string;

  @Column()
  principalCoordinatorName!: string;

  @Column()
  principalCoordinatorMobile!: string;

  @Column()
  principalCoordinatorEmail!: string;

  @Column({ type: "text", nullable: true })
  additionalComments?: string;

  @OneToMany(() => Video, (video) => video.event)
  videos?: Video[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User)
  createdBy!: User;

  @ManyToOne(() => User)
  updatedBy!: User;

  @BeforeInsert()
  generateId() {
    this.id = generateRandomId();
  }
}
