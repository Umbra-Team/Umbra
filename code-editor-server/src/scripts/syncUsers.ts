import AWS, { CognitoIdentityServiceProvider } from 'aws-sdk';
import User from '../models/User';
import dotenv from 'dotenv';



const cognito = new CognitoIdentityServiceProvider();

export async function syncUsers() {
  // Fetch user data from Cognito
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  
  if (!userPoolId) {
    throw new Error('COGNITO_USER_POOL_ID is not defined in the environment variables');
  }

  const params = {
    UserPoolId: userPoolId,
    // Add other parameters as necessary
  };

  const cognitoUsers = await cognito.listUsers(params).promise();

  if (!cognitoUsers.Users) {
    console.log('No users found');
    return;
  }

  console.log(`Found ${cognitoUsers.Users.length} users: ${JSON.stringify(cognitoUsers.Users)}`);

  // Loop through Cognito users and update local database
  for (const cognitoUser of cognitoUsers.Users) {
    const attributes = cognitoUser.Attributes || [];
    const userData = {
      username: cognitoUser.Username,
      cognitoId: attributes.find(attr => attr.Name === 'sub')?.Value,
      email: attributes.find(attr => attr.Name === 'email')?.Value,
      // Map Cognito user data to your Sequelize model fields
    };

    // Use Sequelize to insert or update user in local Postgres
    await User.upsert(userData);
  }
}

