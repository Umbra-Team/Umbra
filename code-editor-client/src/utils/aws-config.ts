import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'us-east-1', // e.g., us-east-1
    userPoolId: 'us-east-1_bJHaaQCxt',
    userPoolWebClientId: '163sq6k8nrq9oq7i80k8o4u9cn',
  },
});
