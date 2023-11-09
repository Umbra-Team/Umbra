// tests/setupTests.ts
import dotenv from 'dotenv';
import path from 'path';
import { beforeEach, afterEach } from '@jest/globals';

dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

import sequelize from '../utils/sequelize';
import '../models/associations';
import User from '../models/User';
import Snippet from '../models/Snippet';

beforeEach(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    await User.sync({ force: true });
    await Snippet.sync({ force: true });

    // Create the user
    try {
        const user = await User.create({
            username: '9439be39-2cd1-400b-b94b-246a3f327726',
            email: 'davidrd123@gmail.com',
            cognitoId: '9439be39-2cd1-400b-b94b-246a3f327726',
        });
        console.log(`user = ${JSON.stringify(user)}`);
    } catch (error) {
        console.log(`Error creating user: ${error}`);
    }
});


afterEach(async () => {
    
    // await sequelize.drop();
    // await sequelize.close();
});