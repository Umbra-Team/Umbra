import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 1,
  iterations: 1000,
  ext: {
    loadimpact: {
      // Project: Default project
      projectID: 3667872,
      // Test runs with the same name groups test runs together.
      name: 'Run code'
    }
  }
};

export default function() {
  const data = {
    language: "deno",
    version: "1.32.3",
    files: [
      {
        content: `
          function fibonacci(n) {
            if (n <= 1) {
              return n;
            } else {
              return fibonacci(n - 1) + fibonacci(n - 2);
            }
          }

          console.log(fibonacci(36));
        `,
      },
    ],
  };

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const url = 'https://ls-capstone-team-1-code-editor-server.8amvljcm2giii.us-west-2.cs.amazonlightsail.com/api/runCode';
  let res = http.post(url, JSON.stringify(data), params);
  console.log(res.body);
  
  console.log(`Status: ${res.status}`);
  
  check(res, {
    "is status 200": (r) => r.status === 200,
    "is status 503": (r) => r.status === 503
  });
  sleep(2);
}