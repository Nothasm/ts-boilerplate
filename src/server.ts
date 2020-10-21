import { App } from "./app";
import { createConnection } from "typeorm";

const { server, port } = new App(createConnection);

server.listen(port, () => console.log(`Server listening on port: ${port}`));
