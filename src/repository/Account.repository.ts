import { EntityRepository, Repository } from "typeorm";
import { Account } from "../models/Account";
import { Service } from "typedi";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";

@Service()
@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
    async findByToken (token: string): Promise<Account> {
        const decoded: {
            accountId: string
        } = jwt.verify(token, process.env.JWT_SECRET) as any;

        const user = await this.findOne(decoded.accountId);
        delete user.password;
        return user;
    }

   async findByCredentials (email: string, password: string): Promise<Account | null> {
        const user: Account = await this.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return null;
        }

        return user;
    }

}