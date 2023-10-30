// models/User.ts
import { Model, DataTypes, HasManyAddAssociationMixin, Association } from 'sequelize';
import File from './File';
import sequelize from '../utils/sequelize';

class User extends Model {
  public id!: number;
  public email!: string;
  public cognitoId!: string;
  
  
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public addFile!: HasManyAddAssociationMixin<File, number>;
  public getFiles!: HasManyAddAssociationMixin<File, number>;

  public static associations: {
    files: Association<User, File>;
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  cognitoId: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  // Add more attributes here
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
});

User.hasMany(File, {
  sourceKey: 'id',
  foreignKey: 'user_id',
  as: 'files',
});

// models/File.ts
// ... Previous definitions
File.belongsTo(User);

export default File;
