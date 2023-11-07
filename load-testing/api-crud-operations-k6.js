import http from 'k6/http';
import { check, group, fail, sleep } from 'k6';

export const options = {
    vus: 10,
    iterations: 100
};

const USERNAME = 'davidrd123@gmail.com';
const PASSWORD = 'bread-first';
const BASE_URL = 'http://localhost:3001/api';

export function setup() {
  let token;
  const setupPayload = JSON.stringify({
    username: USERNAME,
    password: PASSWORD,
  });

  const setupParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(
    `${BASE_URL}/auth/login`, 
    setupPayload,
    setupParams
  );

  console.log(`setup - response: ${res.body}`);
  // Check if login was successful and return the token if it was
  if (!check(res, { 'logged in successfully': (r) => r.status === 200 })) {
    throw new Error('Login failed');
  }

  // Add a try-catch block to handle potential JSON parsing errors
  try {
    token = JSON.parse(res.body).token;
  } catch (error) {
    console.error('Failed to parse token from response body:', error);
  }
  console.log(`Token: ${token}`);
  return token;
}

export default (setupData) => {
  const token = setupData;

  const requestConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  const res = http.get(`${BASE_URL}/snippets`, requestConfig);
  console.log(`response: ${res.body}`);

  let snippetID;
  let snippetTitle;
  let snippetCode;

  group('01. Create a new snippet', () => {
    // Set random title and code
    const randomNumber = Math.floor(Math.random() * 100000) + 1;
    snippetTitle = `Hello World ${randomNumber}!`;
    snippetCode = `console.log("Hello World ${randomNumber}!");`;
    const payload = JSON.stringify({
      title: snippetTitle,
      code: snippetCode,
      language: 'javascript'
    });

    console.log(`requestConfig: ${JSON.stringify(requestConfig)}`);

    const createResponse = http.post(`${BASE_URL}/snippets`, payload, requestConfig);
    console.log(`Create response body: ${createResponse.body}`);
    const createdSnippet = JSON.parse(createResponse.body);
    snippetID = createdSnippet.id;

    check(createResponse, {
      'snippet created successfully': (r) => r.status === 200 && createdSnippet.id !== '',
    });

    sleep(1);
  });

  group('02. Get a snippet', () => {
    const res =  http.get(`${BASE_URL}/snippets/${snippetID}`, requestConfig)
    console.log(`Create response body: ${res.body}`);
    const { id } = JSON.parse(res.body);
    console.log(`ID: ${id}`);
    // const res = http.get(`${BASE_URL}/snippets/${id}`, requestConfig);

    check(res, { 'snippet retrieved successfully': (res) => res.status === 200 });

    sleep(1);
  });

  group('03. Update a snippet', () => {
    const newTitle = `Updated Title ${Math.random() * 1000}`;
    const payload = JSON.stringify({
      title: newTitle,
    });
  
    const updateResponse = http.patch(`${BASE_URL}/snippets/${snippetID}`, payload, requestConfig);
    console.log(`Update response body: ${updateResponse.body}`);
    const updatedSnippet = JSON.parse(updateResponse.body);
  
    check(updateResponse, {
      'snippet updated successfully': (r) => r.status === 200 && updatedSnippet.title === newTitle,
    });

    sleep(1);
  });
  
  group('04. Delete a snippet', () => {
    const deleteResponse = http.del(`${BASE_URL}/snippets/${snippetID}`, null, requestConfig);
    console.log(`Delete response status: ${deleteResponse.status}`);
  
    check(deleteResponse, {
      'snippet deleted successfully': (r) => r.status === 204,
    });

    sleep(1);
  });
}

