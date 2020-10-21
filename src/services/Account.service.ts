import { Service, Inject } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Account } from "../models/Account";
import { AccountRepository } from "../repository/Account.repository";
import { BadRequestError, InternalServerError } from "routing-controllers";
import * as jwt from "jsonwebtoken";

@Service()
export class AccountService {

    @InjectRepository()
    private readonly accountRepository: AccountRepository

    async login (email: Account["email"], password: Account["password"]) {

        const account = await this.accountRepository.findByCredentials(
            email,
            password
        );

        if (!account) throw new BadRequestError("Wrong credentials");

        const token = jwt.sign({
            accountId: account.id
        }, process.env.JWT_SECRET);

        return { token };
    }

    async createAccount (account: Account) {
        const { id, name, email } = await this.accountRepository
            .save(account)
            .catch(e => {
                if (e.code === "23505") throw new BadRequestError("Account already exists");
                console.error(e);
                throw new InternalServerError("");
             });

        return {
            id,
            name,
            email
        };
    }

}
