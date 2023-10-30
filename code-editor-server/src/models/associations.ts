import sequelize from '../utils/sequelize';
import User from './User';
import File from './File';

User.hasMany(File, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'files',
});

File.belongsTo(User, { foreignKey: 'userId' });
