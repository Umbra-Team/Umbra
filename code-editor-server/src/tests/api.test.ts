// tests/api-crud-operations.test.ts
import request from 'supertest';
import app from '../../src/server'; // import your express app
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

describe('Snippet CRUD operations', () => {
    let token: string;
    let snippetId: string;
  
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

      // Create a new snippet
      const res = await request(app)
        .post('/api/snippets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: `Test Snippet ${uuidv4()}`,
          code: 'console.log("Hello, world!");',
          language: 'javascript'
      });

      snippetId = res.body.id;
    });

    it('should fetch a specific snippet', async () => {
      const res = await request(app)
        .get(`/api/snippets/${snippetId}`) // Use the stored snippetId
        .set('Authorization', `Bearer ${token}`);
    
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
    });

    it('should update a specific snippet', async () => {
      const res = await request(app)
        .patch(`/api/snippets/${snippetId}`) // Use the stored snippetId
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: `Test Snippet ${uuidv4()}`,
          code: 'console.log("Hello, brave new world!");',
          language: 'javascript'
      });
    
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body.code).toEqual('console.log("Hello, brave new world!");');
    });

    it('should return a 404 error if the snippet does not exist', async () => {
      const res = await request(app)
        .patch('/api/snippets/555')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated title',
          code: 'console.log("Updated code");',
          language: 'javascript'
        });
    
      expect(res.statusCode).toEqual(404);
    });

    it('should return a 400 error if the snippet data is invalid', async () => {
      const res = await request(app)
        .patch(`/api/snippets/${snippetId}`) // Use the stored snippetId
        .set('Authorization', `Bearer ${token}`)
        .send({ // Missing title
          code: 'console.log("Hello, world!");',
          language: 'javascript'
        });
    
      expect(res.statusCode).toEqual(400);
    });

    it('should delete a specific snippet', async () => {
      const res = await request(app)
        .delete(`/api/snippets/${snippetId}`) // Use the stored snippetId
        .set('Authorization', `Bearer ${token}`);
  
      expect(res.statusCode).toEqual(204);

      // Try to fetch the snippet again
      const res2 = await request(app)
        .get(`/api/snippets/${snippetId}`) // Use the stored snippetId
        .set('Authorization', `Bearer ${token}`);

      expect(res2.statusCode).toEqual(404);
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
  
    it('should return a 400 error if the snippet data is invalid', async () => {
      const res = await request(app)
        .post('/api/snippets')
        .set('Authorization', `Bearer ${token}`)
        .send({ // Missing title
          code: 'console.log("Hello, world!");',
          language: 'javascript'
        });

      expect(res.statusCode).toEqual(400);
    });
    // Add more tests for GET, PATCH, DELETE operations
  });