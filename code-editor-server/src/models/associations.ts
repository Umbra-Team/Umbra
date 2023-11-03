import sequelize from '../utils/sequelize';
import User from './User';
import Snippet from './Snippet';

User.hasMany(Snippet, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'snippets',
});

Snippet.belongsTo(User, { foreignKey: 'userId' });
