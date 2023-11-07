import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10000,
  duration: '30s',
  ext: {
    loadimpact: {
      // Project: Default project
      projectID: 3667872,
      // Test runs with the same name groups test runs together.
      name: 'Load main page'
    }
  }
};

export default function() {
  let res = http.get('https://ls-capstone-team-1-code-editor-server.8amvljcm2giii.us-west-2.cs.amazonlightsail.com');
  check(res, {
    "is status 200": (r) => r.status === 200
  });
  sleep(1);
}
