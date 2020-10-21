import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, BeforeInsert } from "typeorm";
import { IsOptional, IsString, IsEmail } from "class-validator";
import * as bcrypt from "bcryptjs";

@Entity()
export class Account {

    @IsOptional()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @IsString()
    @Column()
    name: string;

    @IsEmail()
    @Column({ unique: true })
    email: string;

    @IsString()
    @Column()
    password: string;

    @BeforeUpdate()
    @BeforeInsert()
    async hashPassword() {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(this.password, salt);
        this.password = passwordHash;
    }
}