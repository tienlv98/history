
import {dbConnection} from "@database";
import App from "./app";

const app = new App();

dbConnection();
app.listen();
