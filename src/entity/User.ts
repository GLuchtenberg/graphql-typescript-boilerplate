import * as bcrypt from "bcryptjs";
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  BeforeInsert
} from "typeorm";
import { Redis } from "ioredis";
import { createEmailConfirmationLink } from "../utils/create-email-confirmation-link";
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 255 })
  email: string;

  @Column("text")
  password: string;

  @Column("boolean", { default: false })
  confirmed: boolean;

  @BeforeInsert()
  async hasPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
  createConfirmationLink(url: string, redis: Redis) {
    return createEmailConfirmationLink(url, this.id, redis);
  }
}
