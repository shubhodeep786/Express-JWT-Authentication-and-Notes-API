/**
 * User model class representing users in the database.
 * Extends sequelize Model and interfaces with the Users table.
 * Defines the user schema and instance methods like addSharedUser.
 */
import { Model, DataTypes, BelongsToManyAddAssociationMixin } from "sequelize";
import sequelize from "../sequelize";

class User extends Model {
  /**
   * Adds a user to the shared users list.
   * @param _userToShareWith - The user to be shared with.
   */
  addSharedUser(_userToShareWith: User) {
    throw new Error("Method not implemented.");
  }
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public addSharedUserMethod!: BelongsToManyAddAssociationMixin<User, number>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Users",
  }
);

export default User;
