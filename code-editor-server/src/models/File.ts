// models/File.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/sequelize';

class File extends Model {
  public id!: number;
  public name!: string;
  public content!: string;
  public userId!: number;
  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
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
    references: {
      model: 'Users',
      key: 'id',
    },
    allowNull: false,
  },
  // add more attributes here
}, {
  sequelize,
  modelName: 'File',
  timestamps: true,
  createdAt: 'created_at',
});

export default File;