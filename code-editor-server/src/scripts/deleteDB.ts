import User from '../models/User';
import Snippets from '../models/Snippet';
import dotenv from 'dotenv';

export const wipeUsers = async () => {
  User.destroy({ 
    where: {},
  })
  .then(() => console.log('All users destroyed'))
  .catch((err) => console.log(err));
}


export const wipeSnippets = async () => {
  Snippets.destroy({ 
    where: {},
  })
  .then(() => console.log('All snippets destroyed'))
  .catch((err) => console.log(err));
}
