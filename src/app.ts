import "reflect-metadata";

import { Application } from "express";
import { Container } from "typedi";
import { useContainer as ormUseContainer } from "typeorm";
import { createExpressServer, useContainer } from "routing-controllers";
import { Connection} from "typeorm";

import { AuthController } from "./controllers/Auth";

import * as morgan from "morgan";

export class App {

    public port = process.env.PORT;
    public server: Application;
    public connection: Connection;

    constructor(createConnection: () => Promise<Connection>) {
        this.inject();
        this.createCon(createConnection)
        this.server = createExpressServer({
            defaultErrorHandler: false,
            middlewares: [__dirname + "/middlewares/global/*{.js,.ts}"],
            cors: true,
            controllers: this.controllers()
        });

        this.server.use(morgan("combined"));
    }

    private createCon(createConnection: () => Promise<Connection>) {
        createConnection().then(async connection => {
            console.log("Connected to DB");
            this.connection = connection;
        }).catch(error => {
            console.log("TypeORM connection error: ", error)
        });
    }

    private inject() {
        useContainer(Container);
        ormUseContainer(Container);
    }

    private controllers() {
        return [
            AuthController
        ];
    }

}
