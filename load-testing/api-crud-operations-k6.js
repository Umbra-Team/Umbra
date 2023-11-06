import http from 'k6/http';
import { check, group, fail } from 'k6';

export const options = {
    vus: 1,
    iterations: 1
};

const USERNAME = 'davidrd123';
const PASSWORD = 'bread-first';
const BASE_URL = 'http://localhost:3001/api';

export function setup() {
  const { token } = http.post(`${BASE_URL}/auth/login`, {
    username: USERNAME,
    password: PASSWORD,
  });

  check(token, { 'logged in successfully': (t) => t !== '' });

  return token;
}

export default (token) => {
  const requestConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  group('01. Create a new snippet', () => {
    const payload = JSON.stringify({
      title: 'My first snippet',
      code: 'console.log("Hello World!");',
      language: 'javascript',
    });

    const { id } = http.post(`${BASE_URL}/snippets`, payload, requestConfig()).json();

    check(id, { 'snippet created successfully': (id) => id !== '' });
  });
}

