// tests/api-crud-operations.test.ts
import request from 'supertest';
import app from '../../src/server'; // import your express app
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { StatusCodes } from 'http-status-codes';

jest.setTimeout(30000); // 30 second timeout
// TODO:
/*
- Creating a snippet with a title that already exists should return a 400 error
- Middleware tests
  - verifyToken - test with valid token, invalid token, no token
  - fetchUser - test with valid user, invalid user
  - fetchSnippet - test with valid snippet, invalid snippet
  - errorHandler - test with SequelizeValidationError, SequelizeUniqueConstraintError, other error
- Authentication tests
  - Test with valid username and password
  - Test with invalid username and password

*/

describe('Snippet CRUD operations', () => {
    let token: string;
    let snippetIds: string[] = [];
  
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

      for (let i = 0; i < 3; i++) {
        // Create a new snippet
        const res = await request(app)
          .post('/api/snippets')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: `Test Snippet ${i}`,
            code: `console.log("Hello, world ${i}!");`,
            language: 'javascript'
        });

        snippetIds[i] = res.body.id;
      }
    });

    describe('POST /api/snippets', () => {
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
    });

    describe('GET /api/snippets', () => {
      it('should fetch all snippets', async () => {
        const res = await request(app)
          .get('/api/snippets')
          .set('Authorization', `Bearer ${token}`);
    
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(snippetIds.length);
      });
    });

    describe('GET /api/snippets/:snippetId', () => {
      it('should fetch a specific snippet', async () => {
        const res = await request(app)
        .get(`/api/snippets/${snippetIds[0]}`) // Use the stored snippetId
        .set('Authorization', `Bearer ${token}`);
    
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.code).toEqual('console.log("Hello, world 0!");');

      });

      it('should return a 404 error if the snippet does not exist', async () => {
        const res = await request(app)
          .get('/api/snippets/555')
          .set('Authorization', `Bearer ${token}`);
    
        expect(res.statusCode).toEqual(404);
      });
    });

    describe('PATCH /api/snippets/:snippetId', () => {
      it("should update a specific snippet", async () => {
        const res = await request(app)
          .patch(`/api/snippets/${snippetIds[0]}`) // Use the stored snippetId
          .set("Authorization", `Bearer ${token}`)
          .send({
            code: 'console.log("Hello, brave new world!");',
            language: "javascript",
          });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("id");
        expect(res.body.code).toEqual(
          'console.log("Hello, brave new world!");'
        );
        expect(res.body.language).toEqual("javascript");
        expect(res.body.title).toEqual(`Test Snippet 0`);
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

      it('should return a 400 error if the snippet data is invalid (duplicate title)', async () => {
        const res = await request(app)
          .patch(`/api/snippets/${snippetIds[0]}`) // Use the stored snippetId for the first snippet
          .set('Authorization', `Bearer ${token}`)
          .send({ 
            title: `Test Snippet 1`, // Duplicate title        
          });
      
        expect(res.statusCode).toEqual(400);
      });
    });

    describe('DELETE /api/snippets/:snippetId', () => {
      it('should delete a specific snippet', async () => {
        const res = await request(app)
          .delete(`/api/snippets/${snippetIds[0]}`) // Use the stored snippetId
          .set('Authorization', `Bearer ${token}`);
    
        expect(res.statusCode).toEqual(204);

        // Try to fetch the snippet again
        const res2 = await request(app)
          .get(`/api/snippets/${snippetIds[0]}`) // Use the stored snippetId
          .set('Authorization', `Bearer ${token}`);

        expect(res2.statusCode).toEqual(404);

        // Try to delete the snippet again
        const res3 = await request(app)
          .delete(`/api/snippets/${snippetIds[0]}`) // Use the stored snippetId
          .set('Authorization', `Bearer ${token}`);

        expect(res3.statusCode).toEqual(404);
      });
  
      it('should return a 404 error if the snippet does not exist', async () => {
        const res = await request(app)
          .delete('/api/snippets/555')
          .set('Authorization', `Bearer ${token}`);
    
        expect(res.statusCode).toEqual(404);
      });

    });

    describe('POST /api/snippetCreateRandom', () => {
      it('should create a new random snippet', async () => {
        // Don't need to send any data
        const res = await request(app)
          .post('/api/snippetCreateRandom')
          .set('Authorization', `Bearer ${token}`)
          .send();
    
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
      });
    });
    
    // Add more tests for GET, PATCH, DELETE operations
  });