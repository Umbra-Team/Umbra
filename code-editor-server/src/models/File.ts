// models/File.ts

import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize';
import sequelize from '../utils/sequelize';
import User from './User';


class File extends Model {
  public id!: number;
  public name!: string;
  public content!: string;
  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public getUser!: BelongsToGetAssociationMixin<User>;
}

File.init({
  // attributes
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'user_id',
  }
  // add more attributes here
}, {
  sequelize,
  modelName: 'File',
  tableName: 'files',
  timestamps: true,
  createdAt: 'created_at',
  underscored: true,
});


export default File;