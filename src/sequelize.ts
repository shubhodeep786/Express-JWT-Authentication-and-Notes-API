/**
 * Creates a new Sequelize instance to connect to the database.
 *
 * The connection configuration like host, database, username etc. are read from environment variables.
 * The models are loaded from the provided path.
 *
 * The initialized sequelize instance is exported as the default export.
 */
import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  database: "mydb",
  username: "myuser",
  password: "mypassword",
  port: parseInt(process.env.DB_PORT || "5432"),
  dialect: "postgres",
  models: [__dirname + "./models/Users.ts"],
});

export default sequelize;
