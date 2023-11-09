// tests/api-crud-operations.test.ts
import request from 'supertest';
import app from '../../src/server'; // import your express app
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

describe('Snippet CRUD operations', () => {
    let token: string;
  
    beforeEach(async () => {
      // Get a token before each test
      const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
      const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: '3rlpf4ht955dmfkb83oh24nf46',
        AuthParameters: {
          USERNAME: 'davidrd123@gmail.com',
          PASSWORD: 'bread-first'
        },
      };
      const data = await cognitoidentityserviceprovider.initiateAuth(params).promise();
      token = data.AuthenticationResult?.AccessToken || '';
    });

    it('should create a new random snippet', async () => {
      // Don't need to send any data
      const res = await request(app)
        .post('/api/snippetCreateRandom')
        .set('Authorization', `Bearer ${token}`)
        .send();

      console.log(`res = ${JSON.stringify(res)}`)
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
        
    });
  
    it('should create a new snippet', async () => {
      const res = await request(app)
        .post('/api/snippets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: `Test Snippet ${uuidv4()}`,
          code: 'console.log("Hello, world!");',
          language: 'javascript'
        });
  
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
    });
  
    // Add more tests for GET, PATCH, DELETE operations
  });