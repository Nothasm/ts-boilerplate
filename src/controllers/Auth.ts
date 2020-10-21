import { JsonController, Post, Body } from "routing-controllers";
import { AccountService } from "../services/Account.service";
import { Login } from "../utils/interfaces";

@JsonController("/login")
export class AuthController {

    constructor(
        private readonly accountService: AccountService
    ) { }

    @Post()
    login(@Body() account: Login) {
        return this.accountService.login(account.email, account.password);
    }

}
