import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'us-west-2', // e.g., us-east-1
    userPoolId: 'us-west-2_357gkng61',
    userPoolWebClientId: '3rlpf4ht955dmfkb83oh24nf46',
  },
});