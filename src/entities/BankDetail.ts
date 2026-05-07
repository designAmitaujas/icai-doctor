import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { generateRandomId } from "../utils.js";
import { User } from "./User.js";

@Entity()
export class BankDetail extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  mrn!: string;

  @Column()
  counsellorName!: string;

  @Column()
  bankAccountNo!: string;

  @Column()
  bankName!: string;

  @Column()
  branchName!: string;

  @Column()
  payeeName!: string;

  @Column()
  ifscCode!: string;

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
