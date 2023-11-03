// models/File.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/sequelize';

class Snippet extends Model {
  public id!: number;
  public title!: string;
  public code!: string;
  public userId!: number;
  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Snippet.init({
  // attributes
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  code: {
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
  modelName: 'Snippet',
  timestamps: true,
  createdAt: 'created_at',
});

export default Snippet;